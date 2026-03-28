"use client";

import { useMemo, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type AdminLoginFormProps = {
  nextPath: string;
  disabledReason: string | null;
};

export default function AdminLoginForm({
  nextPath,
  disabledReason,
}: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const emailRedirectTo = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`;
  }, [nextPath]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabledReason) {
      setMessage(disabledReason);
      return;
    }

    setStatus("sending");
    setMessage(null);

    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo,
          shouldCreateUser: true,
        },
      });

      if (error) {
        setMessage(error.message);
        setStatus("idle");
        return;
      }

      setStatus("sent");
      setMessage(
        "Magic link sent. Open the email on this device and you’ll land back inside the admin panel.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not start the admin sign-in flow.",
      );
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="admin-email"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Admin Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="admin-email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-base"
            required
            disabled={status === "sending"}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-primary/90"
        disabled={status === "sending" || Boolean(disabledReason)}
      >
        {status === "sending" ? "Sending link..." : "Send magic link"}
      </Button>

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Secure admin access
        </div>
        <p>
          Only email addresses inside <code>ADMIN_EMAILS</code> can open the media
          panel, even if someone receives a sign-in link.
        </p>
      </div>

      {message ? (
        <p
          className={`text-sm ${
            status === "sent" ? "text-emerald-300" : "text-amber-200"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
