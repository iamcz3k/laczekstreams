import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_PASSWORD = "czek2991";
const KINDS = ["new", "fix", "improved", "soon"] as const;

// ===== Public: anyone can read active entries =====
export const listChangelog = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("admin_changelog")
    .select("id,kind,title,detail,published_at")
    .eq("active", true)
    .order("published_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return { items: data || [] };
});

// ===== Admin =====
const createSchema = z.object({
  password: z.string(),
  kind: z.enum(KINDS),
  title: z.string().min(1).max(120),
  detail: z.string().max(2000).optional().nullable(),
});

export const adminCreateChangelog = createServerFn({ method: "POST" })
  .inputValidator((d) => createSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) throw new Error("Invalid admin password");
    const { data: row, error } = await supabaseAdmin
      .from("admin_changelog")
      .insert({
        kind: data.kind,
        title: data.title.trim(),
        detail: data.detail?.trim() || null,
        active: true,
      })
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { id: (row as { id: string } | null)?.id ?? null };
  });

export const adminListChangelog = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => {
    if (typeof input?.password !== "string") throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) throw new Error("Invalid admin password");
    const { data: rows, error } = await supabaseAdmin
      .from("admin_changelog")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { items: rows || [] };
  });

export const adminDeleteChangelog = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; id: string }) => {
    if (typeof input?.password !== "string" || !input?.id) throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) throw new Error("Invalid admin password");
    const { error } = await supabaseAdmin.from("admin_changelog").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleChangelog = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; id: string; active: boolean }) => {
    if (typeof input?.password !== "string" || !input?.id) throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) throw new Error("Invalid admin password");
    const { error } = await supabaseAdmin
      .from("admin_changelog")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
