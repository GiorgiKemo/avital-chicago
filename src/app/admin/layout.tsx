import Link from "next/link";
import { requireAdminUser } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import AdminTopNav from "@/components/admin/AdminTopNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminUser("/admin");

  let initialNewQuotesCount = 0;
  let initialUnreadChatCount = 0;
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const [{ count: quoteCount }, { count: chatCount }] = await Promise.all([
      supabase
        .from("quote_submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("chat_sessions")
        .select("id", { count: "exact", head: true })
        .gt("unread_count", 0),
    ]);

    initialNewQuotesCount = quoteCount ?? 0;
    initialUnreadChatCount = chatCount ?? 0;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#08080a] text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#08080a]/80 px-6 backdrop-blur-md">
        <Link href="/admin" className="flex items-center gap-4">
          <span className="text-xl font-serif tracking-tight text-[#d4145a] hover:text-white transition-colors">AVITAL</span>
          <span className="hidden sm:inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">Admin Workspace</span>
        </Link>
        <AdminTopNav
          initialNewQuotesCount={initialNewQuotesCount}
          initialUnreadChatCount={initialUnreadChatCount}
        />
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
