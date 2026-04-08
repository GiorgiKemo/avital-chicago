import { getSupabaseAdmin } from "@/lib/supabase/admin";
import QuoteKanban from "@/components/admin/quotes/QuoteKanban";
import type { QuoteSubmission } from "@/components/admin/quotes/Types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminQuotesPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return <div className="p-8 text-white">Error: Supabase not configured.</div>;
  }

  const { data, error } = await supabase
    .from("quote_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quotes:", error);
    return <div className="p-8 text-white">Error loading quotes.</div>;
  }

  const quotes = (data || []) as QuoteSubmission[];

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[#08080a] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 p-6 px-8 shrink-0">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-white">
            Quote Opportunities
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Manage incoming transport requests in real-time. Drag and drop to update status.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0 relative">
        <QuoteKanban initialQuotes={quotes} />
      </div>
    </div>
  );
}
