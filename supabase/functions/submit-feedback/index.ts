// Supabase Edge Function: submit-feedback
// Recibe el feedback del panel y crea un issue en GitHub usando un token guardado
// como secreto en el servidor (nunca en el cliente).
//
// Secretos requeridos (supabase secrets set ...):
//   GITHUB_TOKEN  → PAT con permiso de escribir issues en el repo (classic: scope "repo";
//                   fine-grained: Issues = Read and write sobre el repo)
//   GITHUB_REPO   → "owner/repo", ej: "mapinosouper/dashboard-bienestar-summa"
//
// Deploy:  supabase functions deploy submit-feedback

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { comment, category, email, view, ua } = await req.json();
    if (!comment || String(comment).trim().length < 3) return json({ error: "Comentario vacío" }, 400);

    const token = Deno.env.get("GITHUB_TOKEN");
    const repo = Deno.env.get("GITHUB_REPO");
    if (!token || !repo) return json({ error: "Función sin configurar (falta GITHUB_TOKEN o GITHUB_REPO)" }, 500);

    const cat = String(category || "otro");
    const clean = String(comment).trim().slice(0, 4000);
    const title = `[Feedback · ${cat}] ${clean.slice(0, 60).replace(/\s+/g, " ")}`;
    const body = [
      clean,
      "",
      "---",
      `**Categoría:** ${cat}`,
      `**Usuario:** ${email || "anónimo"}`,
      `**Vista:** ${view || "-"}`,
      `**Fecha:** ${new Date().toISOString()}`,
      `**Navegador:** ${ua || "-"}`,
      "",
      "_Enviado desde el panel Bienestar Summa._",
    ].join("\n");

    const gh = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "bienestar-summa-feedback",
      },
      body: JSON.stringify({ title, body }),
    });

    if (!gh.ok) {
      const detail = await gh.text();
      return json({ error: `GitHub respondió ${gh.status}`, detail }, 502);
    }
    const issue = await gh.json();
    return json({ ok: true, number: issue.number, url: issue.html_url });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
