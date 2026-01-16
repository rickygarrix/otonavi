import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.json();
    const { action } = body;

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    // =======================
    // ① stores: INSERT / UPDATE
    // =======================
    if (action === "upsert_store") {
      const { id, google_place_id, ...fields } = body;

      // ---------
      // UPDATE
      // ---------
      if (id) {
        const { data, error } = await supabase
          .from("stores")
          .update({ ...fields, google_place_id })
          .eq("id", id)
          .select("id")
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, id: data.id }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // ---------
      // INSERT（新規）
      // ただし google_place_id が既存なら拒否
      // ---------
      if (!google_place_id) {
        return new Response("Missing google_place_id", { status: 400 });
      }

      const { data: existing, error: selectError } = await supabase
        .from("stores")
        .select("id")
        .eq("google_place_id", google_place_id)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        return new Response(
          JSON.stringify({
            success: false,
            reason: "DUPLICATE_PLACE_ID",
            existing_id: existing.id,
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      const { data: inserted, error: insertError } = await supabase
        .from("stores")
        .insert({ ...fields, google_place_id })
        .select("id")
        .single();

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({ success: true, id: inserted.id }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // =======================
    // ② 中間テーブル 差分同期（共通）
    // =======================
    const RELATION_TABLES: Record<string, { table: string; storeKey: string; defKey: string }> = {
      sync_store_customers: { table: "store_customers", storeKey: "store_id", defKey: "customer_id" },
      sync_store_atmosphere: { table: "store_atmosphere", storeKey: "store_id", defKey: "atmosphere_id" },
      sync_store_drinks: { table: "store_drinks", storeKey: "store_id", defKey: "drink_id" },
      sync_store_payments: { table: "store_payments", storeKey: "store_id", defKey: "payment_method_id" },
      sync_store_events: { table: "store_events", storeKey: "store_id", defKey: "event_trend_id" },
      sync_store_baggage: { table: "store_baggage", storeKey: "store_id", defKey: "baggage_id" },
      sync_store_smoking: { table: "store_smoking", storeKey: "store_id", defKey: "smoking_id" },
      sync_store_toilets: { table: "store_toilets", storeKey: "store_id", defKey: "toilet_id" },
      sync_store_environment: { table: "store_environment", storeKey: "store_id", defKey: "environment_id" },
      sync_store_other: { table: "store_other", storeKey: "store_id", defKey: "other_id" },
    };

    if (RELATION_TABLES[action]) {
      const { store_id, ids } = body;
      const { table, storeKey, defKey } = RELATION_TABLES[action];

      if (!store_id || !Array.isArray(ids)) {
        return new Response("Missing store_id or ids", { status: 400 });
      }

      // 既存取得
      const { data: existing, error: fetchError } = await supabase
        .from(table)
        .select(defKey)
        .eq(storeKey, store_id);

      if (fetchError) throw fetchError;

      const existingIds = existing.map((r) => r[defKey]);

      // 差分計算
      const toInsert = ids.filter((id) => !existingIds.includes(id));
      const toDelete = existingIds.filter((id) => !ids.includes(id));

      // INSERT
      if (toInsert.length > 0) {
        const insertData = toInsert.map((id) => ({
          [storeKey]: store_id,
          [defKey]: id,
        }));

        const { error: insertError } = await supabase.from(table).insert(insertData);
        if (insertError) throw insertError;
      }

      // DELETE
      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq(storeKey, store_id)
          .in(defKey, toDelete);

        if (deleteError) throw deleteError;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Invalid action", { status: 400 });

  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});