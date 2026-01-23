import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      return new Response(
        JSON.stringify({ success: false, error: "MISSING_ENV" }),
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    /**************************************
     * 更新（既存店舗）
     **************************************/
    if (action === "upsert_store") {
      console.log("=== UPSERT STORE START ===");

      const storeId = body.id;
      if (!storeId) {
        return new Response(
          JSON.stringify({ success: false, error: "MISSING_STORE_ID" }),
          { status: 400 }
        );
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
        return new Response(
          JSON.stringify({ success: false, step: "stores_upsert", error: storeError }),
          { status: 500 }
        );
      }

      const checks = [
        await replaceM2M(supabase, "store_audience_types", "audience_type_id", storeId, audience_type_ids),
        await replaceM2M(supabase, "store_atmospheres", "atmosphere_id", storeId, atmosphere_ids),
        await replaceM2M(supabase, "store_drinks", "drink_id", storeId, drink_ids),
        await replaceM2M(supabase, "store_environments", "environment_id", storeId, environment_ids),
        await replaceM2M(supabase, "store_event_trends", "event_trend_id", storeId, event_trend_ids),
        await replaceM2M(supabase, "store_luggages", "luggage_id", storeId, luggage_ids),
        await replaceM2M(supabase, "store_payment_methods", "payment_method_id", storeId, payment_method_ids),
        await replaceM2M(supabase, "store_smoking_policies", "smoking_policy_id", storeId, smoking_policy_ids),
        await replaceM2M(supabase, "store_toilets", "toilet_id", storeId, toilet_ids),
        await replaceM2M(supabase, "store_amenities", "amenity_id", storeId, amenity_ids),
      ];

      const failed = checks.find((r) => r && r.ok === false);
      if (failed) {
        return new Response(
          JSON.stringify({ success: false, step: "m2m_upsert", detail: failed }),
          { status: 500 }
        );
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    /**************************************
     * 新規登録（店舗 + 中間テーブル）
     **************************************/
    if (action === "insert_store") {
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

      const { data: insertedStore, error: insertError } = await supabase
        .from("stores")
        .insert(storesOnlyPayload)
        .select("id")
        .single();

      if (insertError) {
        return new Response(
          JSON.stringify({ success: false, step: "stores_insert", error: insertError }),
          { status: 500 }
        );
      }

      const storeId = insertedStore.id;

      const checks = [
        await replaceM2M(supabase, "store_audience_types", "audience_type_id", storeId, audience_type_ids),
        await replaceM2M(supabase, "store_atmospheres", "atmosphere_id", storeId, atmosphere_ids),
        await replaceM2M(supabase, "store_drinks", "drink_id", storeId, drink_ids),
        await replaceM2M(supabase, "store_environments", "environment_id", storeId, environment_ids),
        await replaceM2M(supabase, "store_event_trends", "event_trend_id", storeId, event_trend_ids),
        await replaceM2M(supabase, "store_luggages", "luggage_id", storeId, luggage_ids),
        await replaceM2M(supabase, "store_payment_methods", "payment_method_id", storeId, payment_method_ids),
        await replaceM2M(supabase, "store_smoking_policies", "smoking_policy_id", storeId, smoking_policy_ids),
        await replaceM2M(supabase, "store_toilets", "toilet_id", storeId, toilet_ids),
        await replaceM2M(supabase, "store_amenities", "amenity_id", storeId, amenity_ids),
      ];

      const failed = checks.find((r) => r && r.ok === false);
      if (failed) {
        return new Response(
          JSON.stringify({ success: false, step: "m2m_insert", detail: failed }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: { id: storeId } }),
        { status: 200 }
      );
    }

    /**************************************
     * 新規登録（mentions）
     **************************************/
    if (action === "insert_mention") {
      console.log("=== INSERT MENTION START ===");

      const mentionPayload = {
        store_id: body.store_id,
        text: body.text,
        year: body.year || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (!mentionPayload.store_id || !mentionPayload.text) {
        return new Response(
          JSON.stringify({ success: false, error: "MISSING_STORE_ID_OR_TEXT" }),
          { status: 400 }
        );
      }

      const { data: inserted, error } = await supabase
        .from("mentions")
        .insert(mentionPayload)
        .select("id")
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ success: false, step: "mentions_insert", error }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: { id: inserted.id } }),
        { status: 200 }
      );
    }

    /**************************************
     * 無効化（mentions）
     **************************************/
    if (action === "deactivate_mention") {
      console.log("=== DEACTIVATE MENTION START ===");

      const mentionId = body.id;
      if (!mentionId) {
        return new Response(
          JSON.stringify({ success: false, error: "MISSING_MENTION_ID" }),
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("mentions")
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", mentionId);

      if (error) {
        return new Response(
          JSON.stringify({ success: false, step: "mentions_deactivate", error }),
          { status: 500 }
        );
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    /**************************************
     * store_galleries INSERT / UPDATE（★追加）
     **************************************/
    if (action === "upsert_store_gallery") {
  console.log("=== UPSERT STORE GALLERY START ===");

  const payload = {
    id: body.id || undefined,
    store_id: body.store_id,
    gallery_url: body.gallery_url,
    sort_order: body.sort_order,
    is_active: body.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  if (!payload.store_id || !payload.gallery_url || !payload.sort_order) {
    return new Response(
      JSON.stringify({ success: false, error: "MISSING_REQUIRED_FIELDS" }),
      { status: 400 }
    );
  }

  if (!payload.id) {
    payload.created_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("store_galleries")
    .upsert(payload, {
      // 👇 DBの制約に合わせてどちらか
      // onConflict: "id",
      onConflict: "store_id,sort_order",
    })
    .select("id")
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ success: false, step: "store_galleries_upsert", error }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: { id: data.id } }),
    { status: 200 }
  );
}

    /**************************************
 * store_galleries 非公開
 **************************************/
if (action === "deactivate_store_gallery") {
  console.log("=== DEACTIVATE STORE GALLERY START ===");

  const galleryId = body.id;
  if (!galleryId) {
    return new Response(
      JSON.stringify({ success: false, error: "MISSING_GALLERY_ID" }),
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("store_galleries")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", galleryId);

  if (error) {
    return new Response(
      JSON.stringify({ success: false, step: "store_galleries_deactivate", error }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

    return new Response(
      JSON.stringify({ success: false, error: "UNKNOWN_ACTION" }),
      { status: 400 }
    );
  } catch (err) {
    console.error("FATAL ERROR FULL =", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }),
      { status: 500 }
    );
  }
});

/**************************************
 * 中間テーブル 全置換
 **************************************/
async function replaceM2M(
  supabase,
  tableName,
  foreignKeyName,
  storeId,
  ids
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

  const rows = ids.map((id) => ({
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