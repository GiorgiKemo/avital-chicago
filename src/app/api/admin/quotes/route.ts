import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  const { user, isAdmin } = await getAdminSession();
  
  if (!user || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.id) {
    return NextResponse.json({ error: "Missing quote ID" }, { status: 400 });
  }

  const updates: any = {};
  if (body.status !== undefined) updates.status = body.status;
  if (body.internal_notes !== undefined) updates.internal_notes = body.internal_notes;

  const { error } = await supabase
    .from("quote_submissions")
    .update(updates)
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
