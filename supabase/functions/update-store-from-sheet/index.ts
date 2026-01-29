import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**************************************
 * メインサーバー
 **************************************/
serve(async (req) => {
  try {
    console.log("=== FUNCTION START ===");

    const body = await req.json();
    const action = body.action;

    console.log("ACTION =", action);
    console.log("BODY KEYS =", Object.keys(body));

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("MISSING ENV");
      return jsonError(500, "MISSING_ENV");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    /**************************************
     * stores UPSERT（更新）
     **************************************/
    if (action === "upsert_store") {
      return await handleUpsertStore(supabase, body);
    }


    /**************************************
     * stores INSERT（新規）
     **************************************/
    if (action === "insert_store") {
      return await handleInsertStore(supabase, body);
    }

    /**************************************
     * mentions INSERT
     **************************************/
    if (action === "insert_mention") {
      return await handleInsertMention(supabase, body);
    }

    /**************************************
     * mentions UPSERT
     **************************************/
    if (action === "upsert_mention") {
      return await handleUpsertMention(supabase, body);
    }

    /**************************************
     * mentions 非公開
     **************************************/
    if (action === "deactivate_mention") {
      return await handleDeactivateMention(supabase, body);
    }

    /**************************************
     * store_galleries UPSERT
     **************************************/
    if (action === "upsert_store_gallery") {
      return await handleUpsertStoreGallery(supabase, body);
    }

    /**************************************
     * store_galleries 削除（非公開相当）
     **************************************/
    if (action === "deactivate_store_gallery") {
      return await handleDeactivateStoreGallery(supabase, body);
    }

    return jsonError(400, "UNKNOWN_ACTION");
  } catch (err) {
    console.error("FATAL ERROR FULL =", err);
    return jsonError(500, err instanceof Error ? err.message : String(err));
  }
});

/**************************************
 * Storage: store/galleries/{storeId}/ フォルダ作成
 **************************************/
async function ensureStoreGalleryFolder(supabase: any, storeId: string) {
  const path = `galleries/${storeId}/.keep`;

  const { error } = await supabase.storage
    .from("store")
    .upload(path, new Uint8Array(), {
      upsert: true,
      contentType: "text/plain",
    });

  if (error) {
    console.error("ensureStoreGalleryFolder FAILED", storeId, error);
    throw error;
  }

  console.log("ensureStoreGalleryFolder OK", path);
}

/**************************************
 * stores UPSERT
 **************************************/
async function handleUpsertStore(supabase: any, body: any) {
  console.log("=== UPSERT STORE START ===");

  const storeId = body.id;
  if (!storeId) return jsonError(400, "MISSING_STORE_ID");

  const storePayload = {
    ...body,
    updated_at: new Date().toISOString(),
  };
  delete storePayload.action;

  const {
    audience_type_ids,
    atmosphere_ids,
    drink_ids,
    environment_ids,
    event_trend_ids,
    luggage_ids,
    payment_method_ids,
    smoking_policy_ids,
    toilet_ids,
    amenity_ids,
    ...storesOnlyPayload
  } = storePayload;

  const { error: storeError } = await supabase
    .from("stores")
    .upsert(storesOnlyPayload, { onConflict: "id" });

  if (storeError) {
    return jsonStepError(500, "stores_upsert", storeError);
  }

  const m2mResult = await runAllM2M(supabase, storeId, {
    store_audience_types: ["audience_type_id", audience_type_ids],
    store_atmospheres: ["atmosphere_id", atmosphere_ids],
    store_drinks: ["drink_id", drink_ids],
    store_environments: ["environment_id", environment_ids],
    store_event_trends: ["event_trend_id", event_trend_ids],
    store_luggages: ["luggage_id", luggage_ids],
    store_payment_methods: ["payment_method_id", payment_method_ids],
    store_smoking_policies: ["smoking_policy_id", smoking_policy_ids],
    store_toilets: ["toilet_id", toilet_ids],
    store_amenities: ["amenity_id", amenity_ids],
  });

  if (!m2mResult.ok) {
    return jsonStepError(500, "m2m_upsert", m2mResult);
  }

  return jsonSuccess();
}

/**************************************
 * stores INSERT
 **************************************/
async function handleInsertStore(supabase: any, body: any) {
  console.log("=== INSERT STORE START ===");

  const storePayload = {
    ...body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  delete storePayload.action;

  const {
    audience_type_ids,
    atmosphere_ids,
    drink_ids,
    environment_ids,
    event_trend_ids,
    luggage_ids,
    payment_method_ids,
    smoking_policy_ids,
    toilet_ids,
    amenity_ids,
    ...storesOnlyPayload
  } = storePayload;

  // ===== stores INSERT =====
  const { data: insertedStore, error: insertError } = await supabase
    .from("stores")
    .insert(storesOnlyPayload)
    .select("id")
    .single();

  if (insertError) {
    return jsonStepError(500, "stores_insert", insertError);
  }

  const storeId = insertedStore.id;

  // ★ Storage galleries/{storeId}/ フォルダ作成（追加）
  try {
    await ensureStoreGalleryFolder(supabase, storeId);
  } catch (e) {
    // フォルダ作成失敗でもDBは作れているので
    // ここで止めるか・警告にするかは好み
    console.error("Storage folder create failed", storeId, e);
    return jsonStepError(500, "storage_folder_create", e);
  }

  // ===== M2M =====
  const m2mResult = await runAllM2M(supabase, storeId, {
    store_audience_types: ["audience_type_id", audience_type_ids],
    store_atmospheres: ["atmosphere_id", atmosphere_ids],
    store_drinks: ["drink_id", drink_ids],
    store_environments: ["environment_id", environment_ids],
    store_event_trends: ["event_trend_id", event_trend_ids],
    store_luggages: ["luggage_id", luggage_ids],
    store_payment_methods: ["payment_method_id", payment_method_ids],
    store_smoking_policies: ["smoking_policy_id", smoking_policy_ids],
    store_toilets: ["toilet_id", toilet_ids],
    store_amenities: ["amenity_id", amenity_ids],
  });

  if (!m2mResult.ok) {
    return jsonStepError(500, "m2m_insert", m2mResult);
  }

  return jsonSuccess({ id: storeId });
}

/**************************************
 * mentions
 **************************************/
async function handleInsertMention(supabase: any, body: any) {
  console.log("=== INSERT MENTION START ===");

  if (!body.store_id || !body.text) {
    return jsonError(400, "MISSING_STORE_ID_OR_TEXT");
  }

  const payload = {
    store_id: body.store_id,
    text: body.text,
    year: body.year || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("mentions")
    .insert(payload)
    .select("id")
    .single();

  if (error) return jsonStepError(500, "mentions_insert", error);

  return jsonSuccess({ id: data.id });
}

async function handleUpsertMention(supabase: any, body: any) {
  console.log("=== UPSERT MENTION START ===");

  if (!body.id) return jsonError(400, "MISSING_MENTION_ID");

  const payload = {
    store_id: body.store_id,
    text: body.text,
    year: body.year || null,
    is_active: body.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("mentions")
    .update(payload)
    .eq("id", body.id);

  if (error) return jsonStepError(500, "mentions_upsert", error);

  return jsonSuccess();
}

async function handleDeactivateMention(supabase: any, body: any) {
  console.log("=== DEACTIVATE MENTION START ===");

  if (!body.id) return jsonError(400, "MISSING_MENTION_ID");

  const { error } = await supabase
    .from("mentions")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id);

  if (error) return jsonStepError(500, "mentions_deactivate", error);

  return jsonSuccess();
}

/**************************************
 * store_galleries
 * - gallery_url を主キーとして扱う
 * - gallery_url があれば → sort_order UPDATE
 * - なければ：
 *    - store_id + sort_order があれば → gallery_url UPDATE
 *    - なければ → INSERT
 **************************************/
async function handleUpsertStoreGallery(supabase: any, body: any) {
  console.log("=== UPSERT STORE GALLERY START ===");

  const { store_id, gallery_url, sort_order } = body;

  if (!store_id || !gallery_url || sort_order == null) {
    return jsonError(400, "MISSING_REQUIRED_FIELDS");
  }

  // ================================
  // ① gallery_url で既存を探す
  // ================================
  const { data: byUrl, error: byUrlErr } = await supabase
    .from("store_galleries")
    .select("id, sort_order")
    .eq("gallery_url", gallery_url)
    .maybeSingle();

  if (byUrlErr) {
    return jsonStepError(500, "store_galleries_select_by_url", byUrlErr);
  }

  if (byUrl) {
    const oldSort = byUrl.sort_order;

    // ================================
    // 並び替え衝突チェック
    // ================================
    const { data: bySort, error: bySortErr } = await supabase
      .from("store_galleries")
      .select("id, sort_order")
      .eq("store_id", store_id)
      .eq("sort_order", sort_order)
      .maybeSingle();

    if (bySortErr) {
      return jsonStepError(500, "store_galleries_select_by_sort", bySortErr);
    }

    // ===== 衝突あり → 一時退避つきSWAP =====
    if (bySort && bySort.id !== byUrl.id) {
      console.log("SWAP with TEMP", byUrl.id, "<->", bySort.id);

      // temp は絶対被らない値（負数でOK）
      const tempSort = -Math.floor(Date.now() / 1000);

      // 1) A(byUrl) を temp に退避（oldSort を空ける）
      const { error: step1Err } = await supabase
        .from("store_galleries")
        .update({
          sort_order: tempSort,
          updated_at: new Date().toISOString(),
        })
        .eq("id", byUrl.id);

      if (step1Err) {
        return jsonStepError(500, "store_galleries_swap_temp_a", step1Err);
      }

      // 2) B(bySort) を oldSort に移動
      const { error: step2Err } = await supabase
        .from("store_galleries")
        .update({
          sort_order: oldSort,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bySort.id);

      if (step2Err) {
        return jsonStepError(500, "store_galleries_swap_temp_b", step2Err);
      }

      // 3) A(byUrl) を new sort_order に移動
      const { error: step3Err } = await supabase
        .from("store_galleries")
        .update({
          sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", byUrl.id);

      if (step3Err) {
        return jsonStepError(500, "store_galleries_swap_temp_a_final", step3Err);
      }

      return jsonSuccess({
        id: byUrl.id,
        mode: "update_sort_with_temp_swap",
      });
    }

    // ===== 衝突なし → 普通にUPDATE =====
    const { error: updErr } = await supabase
      .from("store_galleries")
      .update({
        sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", byUrl.id);

    if (updErr) {
      return jsonStepError(500, "store_galleries_update_by_url", updErr);
    }

    return jsonSuccess({
      id: byUrl.id,
      mode: "update_sort_by_url",
    });
  }

  // ================================
  // ② store_id + sort_order で既存を探す（画像差し替え）
  // ================================
  const { data: bySort, error: bySortErr } = await supabase
    .from("store_galleries")
    .select("id")
    .eq("store_id", store_id)
    .eq("sort_order", sort_order)
    .maybeSingle();

  if (bySortErr) {
    return jsonStepError(500, "store_galleries_select_by_sort", bySortErr);
  }

  if (bySort) {
    const { error: updErr } = await supabase
      .from("store_galleries")
      .update({
        gallery_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bySort.id);

    if (updErr) {
      return jsonStepError(500, "store_galleries_update_by_sort", updErr);
    }

    return jsonSuccess({
      id: bySort.id,
      mode: "update_image_by_sort",
    });
  }

  // ================================
  // ③ 完全新規
  // ================================
  const { data, error: insErr } = await supabase
    .from("store_galleries")
    .insert({
      store_id,
      gallery_url,
      sort_order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insErr) {
    return jsonStepError(500, "store_galleries_insert", insErr);
  }

  return jsonSuccess({
    id: data.id,
    mode: "insert",
  });
}

async function handleDeactivateStoreGallery(supabase: any, body: any) {
  console.log("=== DEACTIVATE STORE GALLERY START ===");

  if (!body.id) return jsonError(400, "MISSING_GALLERY_ID");

  const { error } = await supabase
    .from("store_galleries")
    .delete()
    .eq("id", body.id);

  if (error) return jsonStepError(500, "store_galleries_deactivate", error);

  return jsonSuccess();
}

/**************************************
 * M2M 一括実行
 **************************************/
async function runAllM2M(supabase: any, storeId: string, tableMap: any) {
  for (const [tableName, [fkName, ids]] of Object.entries(tableMap)) {
    const res = await replaceM2M(supabase, tableName as string, fkName as string, storeId, ids as any);
    if (!res.ok) return res;
  }
  return { ok: true };
}

/**************************************
 * 中間テーブル 全置換
 **************************************/
async function replaceM2M(
  supabase: any,
  tableName: string,
  foreignKeyName: string,
  storeId: string,
  ids: any
) {
  const { error: delError } = await supabase
    .from(tableName)
    .delete()
    .eq("store_id", storeId);

  if (delError) {
    return { ok: false, step: "delete", tableName, error: delError };
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return { ok: true };
  }

  const rows = ids.map((id: string) => ({
    store_id: storeId,
    [foreignKeyName]: id,
  }));

  const { error: insError } = await supabase
    .from(tableName)
    .insert(rows);

  if (insError) {
    return { ok: false, step: "insert", tableName, rows, error: insError };
  }

  return { ok: true };
}

/**************************************
 * レスポンス共通ヘルパー
 **************************************/
function jsonSuccess(data: Record<string, any> = {}) {
  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
}

function jsonError(status: number, error: any) {
  return new Response(JSON.stringify({ success: false, error }), { status });
}

function jsonStepError(status: number, step: string, error: any) {
  return new Response(JSON.stringify({ success: false, step, error }), { status });
}