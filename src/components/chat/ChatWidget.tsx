"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";

type ChatMessage = {
  id: string;
  session_id: string;
  sender_type: "user" | "admin" | "system";
  content: string;
  created_at: string;
};

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAdmin = pathname?.startsWith("/admin");

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("avital_chat_session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessionId(parsed.sessionId);
        setVisitorName(parsed.visitorName || "");
        setShowNamePrompt(false);
      } catch { /* ignore */ }
    }
  }, []);

  // Load messages when session exists
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/chat?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      });
  }, [sessionId]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!sessionId) return;
    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel(`chat_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const incoming = payload.new as ChatMessage;
          setMessages((prev) => {
            // Skip if we already have this exact ID
            if (prev.some((m) => m.id === incoming.id)) return prev;
            // Replace optimistic temp message with the real one
            const tempIdx = prev.findIndex(
              (m) => m.id.startsWith("temp-") && m.content === incoming.content && m.sender_type === incoming.sender_type
            );
            if (tempIdx !== -1) {
              const updated = [...prev];
              updated[tempIdx] = incoming;
              return updated;
            }
            return [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  const startSession = async () => {
    if (!visitorName.trim()) return;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_session",
          visitor_name: visitorName.trim(),
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSessionId(data.session.id);
        setShowNamePrompt(false);
        localStorage.setItem(
          "avital_chat_session",
          JSON.stringify({ sessionId: data.session.id, visitorName: visitorName.trim() })
        );
      }
    } catch (e) {
      console.error("Failed to start chat session", e);
    }
  };

  const sendMessage = async () => {
    if (!draft.trim() || !sessionId || isSending) return;
    const content = draft.trim();
    setDraft("");
    setIsSending(true);

    // Optimistic add
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      sender_type: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          session_id: sessionId,
          content,
          sender_type: "user",
        }),
      });
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Don't render on admin pages
  if (isAdmin) return null;

  // Floating bubble when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col bg-[#0c0c10] backdrop-blur-xl">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-[var(--primary)] to-[#a0104a] flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wide">Avital Chicago</h3>
          <p className="text-white/70 text-xs">Live Support</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Name prompt or messages */}
      {showNamePrompt ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg">Welcome!</h4>
            <p className="text-white/50 text-sm mt-1">Enter your name to start chatting with our team.</p>
          </div>
          <div className="w-full space-y-3">
            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startSession()}
              placeholder="Your name..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:border-[var(--primary)] outline-none transition-colors"
              autoFocus
            />
            <button
              onClick={startSession}
              disabled={!visitorName.trim()}
              className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-50 text-white font-semibold rounded-xl transition-all text-sm"
            >
              Start Chat
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender_type === "user"
                      ? "bg-[var(--primary)] text-white rounded-br-md"
                      : msg.sender_type === "system"
                      ? "bg-white/5 text-white/60 italic text-xs"
                      : "bg-white/10 text-white/90 rounded-bl-md"
                  }`}
                >
                  {msg.sender_type === "admin" && (
                    <span className="text-[10px] text-[var(--primary)] font-semibold block mb-1">Avital Team</span>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-[#08080a] shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:border-[var(--primary)] outline-none transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!draft.trim() || isSending}
                className="p-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-40 rounded-xl text-white transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
