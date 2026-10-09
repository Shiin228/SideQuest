import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Proof files are stored in the private Supabase Storage bucket "proofs" when SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set, otherwise in <project>/uploads (handy for local development).
 * Either way the database keeps the same "uploads/<file>" path the PHP site used, and files are only
 * served through /uploads/[...path], which checks who is asking.
 */
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const BUCKET = process.env.SUPABASE_PROOF_BUCKET ?? "proofs";

export const MAX_PROOF_BYTES = 10 * 1024 * 1024;

export const PROOF_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

export function proofContentType(fileName: string) {
  return PROOF_TYPES[path.extname(fileName).toLowerCase()] ?? null;
}

let storageClient: SupabaseClient | null | undefined;

function storage() {
  if (storageClient === undefined) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    storageClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  }
  return storageClient;
}

/** Saves an uploaded proof and returns the path stored in the database ("uploads/<file>"). */
export async function saveProof(file: File): Promise<string> {
  const ext = path.extname(file.name).toLowerCase();
  const base =
    path
      .basename(file.name, path.extname(file.name))
      .replace(/[^a-zA-Z0-9._ -]/g, "")
      .trim()
      .slice(0, 80) || "proof";
  const fileName = `${randomUUID().slice(0, 13)}_${base}${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  const client = storage();
  if (client) {
    const { error } = await client.storage.from(BUCKET).upload(fileName, body, {
      contentType: proofContentType(fileName) ?? "application/octet-stream",
      upsert: false,
    });
    if (error) throw new Error(`Proof upload failed: ${error.message}`);
  } else {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, fileName), body);
  }
  return `uploads/${fileName}`;
}

/** Reads a stored proof by its file name (without the "uploads/" prefix). Returns null when missing. */
export async function readProof(fileName: string): Promise<Uint8Array<ArrayBuffer> | null> {
  const client = storage();
  if (client) {
    const { data, error } = await client.storage.from(BUCKET).download(fileName);
    if (error || !data) return null;
    return new Uint8Array(await data.arrayBuffer());
  }

  const resolved = path.resolve(UPLOAD_DIR, fileName);
  if (!resolved.startsWith(UPLOAD_DIR + path.sep)) return null;
  try {
    return new Uint8Array(await readFile(resolved));
  } catch {
    return null;
  }
}
