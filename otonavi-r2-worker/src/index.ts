export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    // 動作確認用
    if (request.method === "GET" && url.pathname === "/") {
      return Response.json({ ok: true });
    }

    // アップロード
    if (request.method === "POST" && url.pathname === "/upload") {
      const form = await request.formData();

      const file = form.get("file");
      const type = String(form.get("type") ?? "");
      const id = String(form.get("id") ?? "");

      if (!(file instanceof File)) {
        return new Response("file is required", { status: 400 });
      }
      if (!type || !id) {
        return new Response("type and id are required", { status: 400 });
      }

      const ext = guessExt(file.type, file.name); // jpg/png etc
      const uuid = crypto.randomUUID();
      const filename = `${uuid}.${ext}`;

      const key = buildKey({ type, id, filename, ext });

      // R2へ保存
      await env.R2_STAGING.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type || "application/octet-stream",
          cacheControl: "public, max-age=31536000, immutable",
        },
      });

      return Response.json({ ok: true, key });
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;

/* =========================
   helpers
========================= */

function buildKey(args: {
  type: string;
  id: string;
  filename: string;
  ext: string;
}) {
  const { type, id, filename, ext } = args;

  switch (type) {
    case "gallery":
      return `stores/galleries/${id}/${filename}`;

    case "post":
      return `stores/posts/${id}/${filename}`;

    case "avatar":
      // avatarは固定名が運用ラク（上書きできる）
      return `users/${id}/avatar.${ext}`;

    default:
      throw new Error("invalid type");
  }
}

function guessExt(mime: string, name: string) {
  // まず mime優先
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";

  // 最後にファイル名から推測
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = m?.[1];
  if (ext === "jpg" || ext === "jpeg") return "jpg";
  if (ext === "png") return "png";
  if (ext === "webp") return "webp";

  return "bin";
}