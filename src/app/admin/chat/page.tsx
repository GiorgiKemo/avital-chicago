import { getSupabaseAdmin } from "@/lib/supabase/admin";
import AdminChatInbox from "@/components/admin/chat/AdminChatInbox";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminChatPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return <div className="p-8 text-white">Error: Supabase not configured.</div>;
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat sessions:", error);
    return <div className="p-8 text-white">Error loading chat sessions.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#08080a] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 p-6 px-8 shrink-0">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-white">
            Live Chat Inbox
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Reply to customer conversations in real-time.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0 relative">
        <AdminChatInbox initialSessions={data || []} />
      </div>
    </div>
  );
}
