import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import {
  getAdminDisabledReason,
  isAdminBypassEnabled,
  getAdminSession,
  getSafeNextPath,
} from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "unauthorized":
      return "That email is signed in, but it is not allowlisted for admin access yet.";
    case "expired":
      return "That sign-in link is no longer valid. Request a fresh one.";
    default:
      return null;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);
  const disabledReason = getAdminDisabledReason();

  if (isAdminBypassEnabled()) {
    redirect(nextPath);
  }

  const { user, isAdmin } = await getAdminSession();

  if (user && isAdmin) {
    redirect(nextPath);
  }

  const errorMessage = getErrorMessage(params.error);

  return (
    <section className="relative overflow-hidden py-24">
      <div className="blur-orb left-0 top-24 h-72 w-72" />
      <div className="blur-orb bottom-0 right-0 h-80 w-80" />

      <div className="container mx-auto max-w-5xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <p className="pink-label">Admin Access</p>
            <h1 className="section-heading max-w-2xl">
              Manage uploaded media without touching the live codebase.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              This panel is for new admin-managed assets. The legacy gallery inside{" "}
              <code>public/images</code> still stays in the repo for stability.
            </p>
            <div className="glass-card grid gap-4 rounded-[28px] p-6 text-sm text-muted-foreground">
              <p>
                Use this login to upload new photos, remove outdated ones, and grab
                public URLs for the site.
              </p>
              <p>
                The login uses Supabase magic links, and the final gate is your
                email allowlist. Nothing is exposed to the public side of the
                website.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
              >
                Need help? Contact the site team
              </Link>
            </div>
          </div>

          <div className="glass-card-glow rounded-[30px] p-8">
            <h2 className="mb-2 font-serif text-3xl text-foreground">
              Sign in to admin
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              We&apos;ll email you a one-time sign-in link.
            </p>
            {errorMessage ? (
              <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                {errorMessage}
              </div>
            ) : null}
            {disabledReason ? (
              <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                {disabledReason}
              </div>
            ) : null}
            <AdminLoginForm nextPath={nextPath} disabledReason={disabledReason} />
          </div>
        </div>
      </div>
    </section>
  );
}
