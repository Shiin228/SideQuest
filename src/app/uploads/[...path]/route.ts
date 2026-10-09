import path from "node:path";
import { canViewProof } from "@/lib/quests";
import { getSession } from "@/lib/session";
import { proofContentType, readProof } from "@/lib/uploads";

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const session = await getSession();
  if (!session) return new Response("Not signed in", { status: 401 });

  const { path: segments } = await ctx.params;
  const fileName = segments.map(decodeURIComponent).join("/");
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return new Response("Not found", { status: 404 });
  }

  const type = proofContentType(fileName);
  if (!type) return new Response("Not found", { status: 404 });

  // Only the quest's poster and its assigned freelancer may see a proof.
  if (!(await canViewProof(session.userId, `uploads/${fileName}`))) {
    return new Response("Not found", { status: 404 });
  }

  const data = await readProof(fileName);
  if (!data) return new Response("Not found", { status: 404 });

  return new Response(data, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${path.basename(fileName).replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
