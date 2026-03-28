import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getSafeNextPath, isAdminEmail } from "@/lib/admin-auth";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextPath = getSafeNextPath(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const supabase = await getSupabaseServer();
  let authError: string | null = null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authError = error?.message ?? null;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    authError = error?.message ?? null;
  } else {
    authError = "Missing confirmation token.";
  }

  if (authError) {
    return NextResponse.redirect(
      new URL("/admin/login?error=expired", request.url),
      303,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL("/admin/login?error=unauthorized", request.url),
      303,
    );
  }

  return NextResponse.redirect(new URL(nextPath, request.url), 303);
}
