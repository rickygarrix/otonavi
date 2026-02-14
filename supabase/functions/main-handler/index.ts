import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/*************************************************
 * Main
 *************************************************/
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("=== FUNCTION START ===");

    const body = await req.json().catch(() => null);
    if (!body || !body.action) {
      return jsonError(400, "INVALID_BODY");
    }

    const action = body.action;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return jsonError(500, "ENV_MISSING");
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey,
      { auth: { persistSession: false } }
    );

    let result: Response;

    switch (action) {
      case "insert_store":
        result = await handleInsertStore(supabase, body);
        break;

      case "upsert_store":
        result = await handleUpsertStore(supabase, body);
        break;

      // 🔥 gallery 単体
      case "upsert_store_gallery":
        result = await handleUpsertStoreGallery(supabase, body);
        break;

      // 🔥 gallery 一括（GAS本命）
      case "bulk_upsert_store_gallery":
        result = await handleBulkUpsertStoreGallery(
          supabase,
          body
        );
        break;

      default:
        return jsonError(400, "UNKNOWN_ACTION");
    }

    return result;
  } catch (err) {
    console.error("FATAL ERROR =", err);
    return jsonError(
      500,
      err instanceof Error ? err.message : String(err)
    );
  }
});

/*************************************************
 * ✅ R2: Worker経由でフォルダ作成
 *************************************************/
async function ensureR2StoreFolder(storeId: string) {
  const workerUrl = Deno.env.get("R2_WORKER_URL");

  if (!workerUrl) {
    throw new Error("R2_WORKER_URL_MISSING");
  }

  const res = await fetch(workerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "ensure_store_folder",
      storeId,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("WORKER_ERROR: " + text);
  }

  console.log("✅ Worker ensure folder success:", storeId);
}

/*************************************************
 * stores INSERT
 *************************************************/
async function handleInsertStore(
  supabase: any,
  body: any
) {
  const now = new Date().toISOString();

  const storePayload = {
    ...body,
    created_at: now,
    updated_at: now,
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

  const { data: insertedStore, error: insertError } =
    await supabase
      .from("stores")
      .insert(storesOnlyPayload)
      .select("id")
      .single();

  if (insertError) {
    return jsonStepError(500, "stores_insert", insertError);
  }

  const storeId = insertedStore.id;

  // ✅ R2フォルダ作成
  try {
    await ensureR2StoreFolder(storeId);
  } catch (e) {
    console.error("⚠️ R2 folder create failed:", storeId, e);
  }

  const m2mResult = await runAllM2M(
    supabase,
    storeId,
    {
      store_audience_types: ["audience_type_id", audience_type_ids],
      store_atmospheres: ["atmosphere_id", atmosphere_ids],
      store_drinks: ["drink_id", drink_ids],
      store_environments: ["environment_id", environment_ids],
      store_event_trends: ["event_trend_id", event_trend_ids],
      store_luggages: ["luggage_id", luggage_ids],
      store_payment_methods: [
        "payment_method_id",
        payment_method_ids,
      ],
      store_smoking_policies: [
        "smoking_policy_id",
        smoking_policy_ids,
      ],
      store_toilets: ["toilet_id", toilet_ids],
      store_amenities: ["amenity_id", amenity_ids],
    }
  );

  if (!m2mResult.ok) {
    return jsonStepError(500, "m2m_insert", m2mResult);
  }

  return jsonSuccess({ id: storeId });
}

/*************************************************
 * stores UPSERT
 *************************************************/
async function handleUpsertStore(
  supabase: any,
  body: any
) {
  const storeId = body.id;
  if (!storeId) {
    return jsonError(400, "MISSING_STORE_ID");
  }

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

  const m2mResult = await runAllM2M(
    supabase,
    storeId,
    {
      store_audience_types: ["audience_type_id", audience_type_ids],
      store_atmospheres: ["atmosphere_id", atmosphere_ids],
      store_drinks: ["drink_id", drink_ids],
      store_environments: ["environment_id", environment_ids],
      store_event_trends: ["event_trend_id", event_trend_ids],
      store_luggages: ["luggage_id", luggage_ids],
      store_payment_methods: [
        "payment_method_id",
        payment_method_ids,
      ],
      store_smoking_policies: [
        "smoking_policy_id",
        smoking_policy_ids,
      ],
      store_toilets: ["toilet_id", toilet_ids],
      store_amenities: ["amenity_id", amenity_ids],
    }
  );

  if (!m2mResult.ok) {
    return jsonStepError(500, "m2m_upsert", m2mResult);
  }

  return jsonSuccess();
}

/*************************************************
 * 🔥 store_galleries 単体UPSERT
 *************************************************/
async function handleUpsertStoreGallery(
  supabase: any,
  body: any
) {
  const { store_id, gallery_url, sort_order } = body;

  if (!store_id || !gallery_url) {
    return jsonError(400, "INVALID_PARAMS");
  }

  const { error } = await supabase
    .from("store_galleries")
    .upsert(
      {
        store_id,
        gallery_url,
        sort_order: sort_order ?? 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "store_id,gallery_url" }
    );

  if (error) {
    return jsonStepError(500, "gallery_upsert", error);
  }

  return jsonSuccess();
}

/*************************************************
 * 🔥 store_galleries BULK UPSERT（本命）
 *************************************************/
async function handleBulkUpsertStoreGallery(
  supabase: any,
  body: any
) {
  const list = body.data;

  if (!Array.isArray(list) || list.length === 0) {
    return jsonError(400, "EMPTY_DATA");
  }

  const now = new Date().toISOString();

  try {
    // ===============================
    // ✅ store_id 一覧抽出
    // ===============================
    const storeIds = [
      ...new Set(list.map((r: any) => r.store_id)),
    ];

    console.log("target stores =", storeIds);

    // ===============================
    // 🔥 既存 sort_order を一時退避
    // ===============================
    for (const storeId of storeIds) {
      const { error: bumpError } = await supabase.rpc(
        "bump_store_gallery_sort_orders",
        {
          target_store_id: storeId,
          bump_value: 1000,
        }
      );

      if (bumpError) {
        console.error("bump failed", bumpError);
        return jsonStepError(
          500,
          "bump_sort_order",
          bumpError
        );
      }
    }

    // ===============================
    // 🔥 UPSERT
    // ===============================
    const rows = list.map((row: any) => ({
      store_id: row.store_id,
      gallery_url: row.gallery_url,
      sort_order: row.sort_order ?? 0,
      updated_at: now,
    }));

    const { error } = await supabase
      .from("store_galleries")
      .upsert(rows, {
        onConflict: "store_id,gallery_url",
      });

    if (error) {
      return jsonStepError(500, "bulk_gallery_upsert", error);
    }

    return jsonSuccess({ count: rows.length });
  } catch (e) {
    return jsonStepError(500, "bulk_gallery_upsert_fatal", e);
  }
}

/*************************************************
 * M2M helpers
 *************************************************/
async function runAllM2M(
  supabase: any,
  storeId: string,
  tableMap: any
) {
  for (const [tableName, [fkName, ids]] of Object.entries(
    tableMap
  )) {
    const res = await replaceM2M(
      supabase,
      tableName as string,
      fkName as string,
      storeId,
      ids as any
    );
    if (!res.ok) return res;
  }
  return { ok: true };
}

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
    return {
      ok: false,
      step: "insert",
      tableName,
      rows,
      error: insError,
    };
  }

  return { ok: true };
}

/*************************************************
 * response helpers
 *************************************************/
function jsonSuccess(data: Record<string, any> = {}) {
  return new Response(JSON.stringify({ success: true, data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

function jsonError(status: number, error: any) {
  return new Response(JSON.stringify({ success: false, error }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

function jsonStepError(
  status: number,
  step: string,
  error: any
) {
  return new Response(
    JSON.stringify({ success: false, step, error }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    }
  );
}