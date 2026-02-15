export interface Env {
  R2_BUCKET: R2Bucket;
}

type RequestBody = {
  action?: string;
  storeId?: string;
};

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      const body = (await req.json()) as RequestBody;
      const { action, storeId } = body;

      if (action !== "ensure_store_folder") {
        return new Response("UNKNOWN_ACTION", { status: 400 });
      }

      if (!storeId) {
        return new Response("MISSING_STORE_ID", { status: 400 });
      }

      const key = `stores/galleries/${storeId}/.keep`;

      await env.R2_BUCKET.put(key, "");

      console.log("R2 folder created:", key);

      return Response.json({ success: true, key });
    } catch (err) {
      console.error(err);
      return new Response(String(err), { status: 500 });
    }
  },
};