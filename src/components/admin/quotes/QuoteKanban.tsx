"use client";

import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User, Calendar, MapPin, Truck, Mail, Phone, FileText, X, Check } from "lucide-react";
import type { QuoteSubmission, QuoteStatus } from "./Types";

const COLUMNS: { id: QuoteStatus; title: string; color: string }[] = [
  { id: "new", title: "New Leads", color: "bg-[#0ea5e9]" },
  { id: "contacted", title: "Contacted", color: "bg-[#f59e0b]" },
  { id: "quoted", title: "Quoted", color: "bg-[#8b5cf6]" },
  { id: "booked", title: "Booked", color: "bg-[#10b981]" },
  { id: "lost", title: "Lost", color: "bg-[#ef4444]" },
];

export default function QuoteKanban({ initialQuotes }: { initialQuotes: QuoteSubmission[] }) {
  const [quotes, setQuotes] = useState<QuoteSubmission[]>(initialQuotes);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [draggedQuoteId, setDraggedQuoteId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Realtime subscription
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel("quote_submissions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quote_submissions",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuotes((prev) => [payload.new as QuoteSubmission, ...prev]);
            toast.success("New quote request received!");
          } else if (payload.eventType === "UPDATE") {
            setQuotes((prev) =>
              prev.map((q) => (q.id === payload.new.id ? (payload.new as QuoteSubmission) : q))
            );
          } else if (payload.eventType === "DELETE") {
            setQuotes((prev) => prev.filter((q) => q.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateQuoteStatus = async (id: string, newStatus: QuoteStatus) => {
    // Optimistic UI update
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );

    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      if (typeof window !== "undefined" && newStatus === "booked") {
        window.gtag_report_conversion?.();
      }

      toast.success("Status updated");
    } catch {
      toast.error("Could not update quote status");
      // Could revert state here
    }
  };

  const saveInternalNotes = async (id: string) => {
    setIsSavingNotes(true);
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, internal_notes: notesDraft } : q))
    );

    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, internal_notes: notesDraft }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedQuoteId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, columnId: QuoteStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const quote = quotes.find((q) => q.id === id);
    if (!quote || quote.status === columnId) return;
    updateQuoteStatus(id, columnId);
    setDraggedQuoteId(null);
  };

  const activeQuote = quotes.find((q) => q.id === activeQuoteId) || null;

  return (
    <div className="absolute inset-0 flex">
      {/* Kanban Board Container */}
      <div className={`flex-1 flex overflow-hidden p-4 gap-4 transition-all duration-300 ${activeQuoteId ? "mr-[400px]" : ""}`}>
        {COLUMNS.map((col) => {
          const colQuotes = quotes.filter((q) => q.status === col.id);
          return (
            <div
              key={col.id}
              className="flex-1 min-w-0 flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="px-3 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="font-semibold text-white/90 uppercase tracking-wider text-xs">
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                  {colQuotes.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {colQuotes.map((q) => (
                  <div
                    key={q.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, q.id)}
                    onClick={() => {
                       setActiveQuoteId(q.id);
                       setNotesDraft(q.internal_notes || "");
                    }}
                    className={`p-3 rounded-xl bg-[#1a1a20] border border-white/10 hover:border-white/20 cursor-grab active:cursor-grabbing transition-all ${draggedQuoteId === q.id ? "opacity-50 scale-95" : "hover:shadow-lg"} group`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-white/90 truncate">{q.full_name}</h4>
                      <span className="text-[10px] text-white/40 whitespace-nowrap ml-2">
                        {new Date(q.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 space-y-1 mt-3">
                      {q.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-[var(--primary)] opacity-70" />
                          <span className="truncate">{new Date(q.event_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {q.service_type && (
                        <div className="flex items-center gap-2">
                          <Truck className="w-3 h-3 text-[var(--primary)] opacity-70" />
                          <span className="truncate">{q.service_type}</span>
                        </div>
                      )}
                      {q.passengers && (
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-[var(--primary)] opacity-70" />
                          <span>{q.passengers} pax</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {colQuotes.length === 0 && (
                  <div className="h-full min-h-[100px] flex items-center justify-center">
                    <p className="text-xs text-white/20 uppercase tracking-widest border border-dashed border-white/10 w-full text-center py-6 rounded-lg">Drop Here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Slide-Over */}
      <div 
        className={`absolute top-0 right-0 h-full w-[400px] bg-[#0c0c0f] border-l border-white/10 shadow-2xl transition-transform duration-300 transform ${activeQuoteId ? 'translate-x-0' : 'translate-x-[100%]'} z-20 flex flex-col`}
      >
        {activeQuote && (
           <>
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#00000080] backdrop-blur-md">
                <h2 className="text-lg font-serif text-white">Quote Details</h2>
                <button onClick={() => setActiveQuoteId(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Contact Info */}
                <section>
                   <h3 className="text-xs uppercase tracking-widest text-[#d4145a] font-semibold mb-4">Contact Info</h3>
                   <div className="space-y-4">
                     <div className="flex items-start gap-3">
                         <User className="w-4 h-4 text-white/40 mt-0.5" />
                         <div>
                             <p className="text-sm text-white/90 font-medium">{activeQuote.full_name}</p>
                         </div>
                     </div>
                     <div className="flex items-start gap-3">
                         <Mail className="w-4 h-4 text-white/40 mt-0.5" />
                         <div>
                             <a href={`mailto:${activeQuote.email}`} className="text-sm hover:text-[var(--primary)] text-white/70 transition-colors">{activeQuote.email}</a>
                         </div>
                     </div>
                     <div className="flex items-start gap-3">
                         <Phone className="w-4 h-4 text-white/40 mt-0.5" />
                         <div>
                             <a href={`tel:${activeQuote.phone}`} className="text-sm hover:text-[var(--primary)] text-white/70 transition-colors">{activeQuote.phone}</a>
                         </div>
                     </div>
                   </div>
                </section>

                {/* Event Details */}
                <section>
                   <h3 className="text-xs uppercase tracking-widest text-[#d4145a] font-semibold mb-4">Event Details</h3>
                   <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/80">{activeQuote.event_date ? new Date(activeQuote.event_date).toLocaleDateString() : 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/80">{activeQuote.service_type || 'N/A'} <span className="text-white/30 truncate mx-2">|</span> {activeQuote.vehicle_type || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/80">{activeQuote.pickup_location || 'N/A'} &rarr; {activeQuote.dropoff_location || 'N/A'}</span>
                     </div>
                   </div>
                </section>

                <hr className="border-white/10" />

                {/* Internal Notes */}
                <section className="flex-1 flex flex-col min-h-[200px]">
                   <h3 className="text-xs uppercase tracking-widest text-[#d4145a] font-semibold mb-2 flex items-center gap-2">
                     <FileText className="w-3.5 h-3.5" /> Internal Notes
                   </h3>
                   <p className="text-[10px] text-white/40 mb-3">These notes are strictly private and synced across all staff.</p>
                   <textarea
                     value={notesDraft}
                     onChange={(e) => setNotesDraft(e.target.value)}
                     className="w-full h-32 flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white/90 placeholder:text-white/20 focus:border-[#d4145a] focus:ring-1 focus:ring-[#d4145a] resize-none transition-all outline-none"
                     placeholder="Add private staff notes here..."
                   />
                   <div className="mt-4 flex justify-end">
                     <button
                       onClick={() => saveInternalNotes(activeQuote.id)}
                       disabled={isSavingNotes || notesDraft === (activeQuote.internal_notes || '')}
                       className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 border border-white/10 rounded text-sm text-white font-medium transition-all flex items-center gap-2"
                     >
                        {isSavingNotes ? "Saving..." : <><Check className="w-4 h-4 text-[var(--primary)]" /> Save Notes</>}
                     </button>
                   </div>
                </section>

            </div>
           </>
        )}
      </div>

    </div>
  );
}
