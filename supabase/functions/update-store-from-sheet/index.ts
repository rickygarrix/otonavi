// ===============================
// 🔗 Supabase Edge Function 設定
// ===============================
const SUPABASE_FUNCTION_URL =
  "https://tphptguwscpmraqxwdoi.functions.supabase.co/update-store-from-sheet";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaHB0Z3V3c2NwbXJhcXh3ZG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTA4MjQsImV4cCI6MjA4MzU4NjgyNH0.0VRdZqZ-v2EpUEIznWr-aiLoIIYo_BomXqQEP1jHALw";

// ===============================
// 📘 マスターシート読み込み
// label(日本語) → id の Map を作る
// ===============================
function loadMasterMap(sheetName, labelCol, idCol) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error(`マスターシートが見つかりません: ${sheetName}`);

  const values = sheet.getDataRange().getValues();
  const headers = values[0];

  const labelIndex = headers.indexOf(labelCol);
  const idIndex = headers.indexOf(idCol);

  if (labelIndex === -1 || idIndex === -1) {
    throw new Error(`${sheetName} のカラム名が正しくありません`);
  }

  const map = {};
  for (let i = 1; i < values.length; i++) {
    const label = values[i][labelIndex];
    const id = values[i][idIndex];
    if (label && id) {
      map[label] = id;
    }
  }
  return map;
}

// ===============================
// 🔄 1行を Supabase に同期（UPSERT）
// ・新規: id なし → INSERT
// ・既存: id あり → UPDATE
// ・成功時は { success, id } を返す想定
// ===============================
function syncRowToSupabase(row, masters) {
  const payload = {
    action: "upsert_store",

    id: row["店舗ID"],

    name: row["店名*"],
    kana: row["読み方*"],
    google_place_id: row["Google Place ID*"],

    prefecture_id: masters.prefectures[row["都道府県*"]] || null,
    municipality_id: masters.municipalities[row["市区町村*"]] || null,
    area_id: masters.municipalities[row["エリア"]] || null,

    postcode: row["郵便番号*"],
    address: row["所在地*"],
    access: row["アクセス*"],
    description: row["説明"],
    official_site_url: row["公式サイト"],
    instagram_url: row["Instagram"],
    x_url: row["X"],
    facebook_url: row["Facebook"],
    tiktok_url: row["TikTok"],
    business_hours: row["営業時間"],

    store_type_id: masters.venueTypes[row["店舗タイプ"]] || null,
    size: masters.sizes[row["広さ"]] || null,
    price_range_id: masters.priceRanges[row["価格帯"]] || null,

    payment_method_other: row["その他の支払い方法"],
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + SUPABASE_ANON_KEY,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const res = UrlFetchApp.fetch(SUPABASE_FUNCTION_URL, options);
  const text = res.getContentText();
  Logger.log(text);

  try {
    const json = JSON.parse(text);
    return json; // { success: boolean, id?: string, reason?: string }
  } catch (e) {
    Logger.log("レスポンスの JSON 解析に失敗");
    return { success: false, error: "INVALID_JSON" };
  }
}

// ===============================
// 🚀 本番用：詳細情報シートをすべて同期
// ・新規: 「公開待ち」かつ 店舗ID空 かつ PlaceID重複なし → INSERT
// ・既存: 店舗IDあり → UPDATE
// ・新規成功後: 店舗ID書き戻し + ステータスを「公開済み」へ
// ===============================
function syncAllStores() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("詳細情報");
  if (!sheet) throw new Error("「詳細情報」シートが見つかりません");

  const values = sheet.getDataRange().getValues();
  const headers = values[0];

  // ヘッダ → 列番号
  const colIndex = {};
  headers.forEach((h, i) => (colIndex[h] = i));

  // ===============================
  // 📘 マスターは一度だけロード
  // ===============================
  const masters = {
    prefectures: loadMasterMap("prefectures", "name_ja", "id"),
    municipalities: loadMasterMap("municipalities", "name", "id"),
    venueTypes: loadMasterMap("venue_types", "label", "id"),
    sizes: loadMasterMap("sizes", "label", "id"),
    priceRanges: loadMasterMap("price_ranges", "label", "id"),
  };

  // ===============================
  // 🔁 Place ID の重複チェック用カウント
  // ===============================
  const placeIdCount = {};
  for (let i = 1; i < values.length; i++) {
    const placeId = values[i][colIndex["Google Place ID*"]];
    if (placeId) {
      placeIdCount[placeId] = (placeIdCount[placeId] || 0) + 1;
    }
  }

  // ===============================
  // 🔁 各行を処理
  // ===============================
  for (let i = 1; i < values.length; i++) {
    const rowArr = values[i];
    const row = {};
    headers.forEach((h, j) => (row[h] = rowArr[j]));

    const storeId = row["店舗ID"];
    const placeId = row["Google Place ID*"];
    const status = row["ステータス"];

    // ===============================
    // 🆕 新規登録対象
    // ===============================
    if (!storeId && status === "公開待ち") {
      if (!placeId) {
        Logger.log(`行 ${i + 1}: Place ID なし → スキップ`);
        continue;
      }

      if (placeIdCount[placeId] > 1) {
        Logger.log(`行 ${i + 1}: Place ID 重複 → スキップ`);
        continue;
      }

      const result = syncRowToSupabase(row, masters);

      if (result && result.success && result.id) {
        // ① 店舗IDを書き戻す
        sheet.getRange(i + 1, colIndex["店舗ID"] + 1).setValue(result.id);
        // ② ステータスを「公開済み」に変更
        sheet.getRange(i + 1, colIndex["ステータス"] + 1).setValue("公開済み");

        Logger.log(`行 ${i + 1}: 新規登録完了 → ID: ${result.id}`);
      } else {
        Logger.log(`行 ${i + 1}: 新規登録失敗 → ${JSON.stringify(result)}`);
      }

      continue;
    }

    // ===============================
    // ♻ 既存店舗の更新
    // ===============================
    if (storeId) {
      const result = syncRowToSupabase(row, masters);
      if (result && result.success) {
        Logger.log(`行 ${i + 1}: 更新完了`);
      } else {
        Logger.log(`行 ${i + 1}: 更新失敗 → ${JSON.stringify(result)}`);
      }
      continue;
    }

    Logger.log(`行 ${i + 1}: 条件外 → スキップ`);
  }

  Logger.log("=== 同期完了 ===");
}