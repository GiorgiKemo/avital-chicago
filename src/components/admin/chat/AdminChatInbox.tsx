"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Send, MessageCircle, User, Clock, Archive } from "lucide-react";

type ChatSession = {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: "active" | "closed";
  unread_count: number;
  last_message_at: string;
  created_at: string;
};

type ChatMessage = {
  id: string;
  session_id: string;
  sender_type: "user" | "admin" | "system";
  content: string;
  created_at: string;
};

export default function AdminChatInbox({
  initialSessions,
}: {
  initialSessions: ChatSession[];
}) {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [filter, setFilter] = useState<"active" | "closed" | "all">("active");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const markSessionAsRead = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, unread_count: 0 } : session
      )
    );

    void fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_read", session_id: sessionId }),
    });
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime: listen for new sessions
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel("admin_chat_sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_sessions" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setSessions((prev) => [payload.new as ChatSession, ...prev]);
            toast.success(`New chat from ${(payload.new as ChatSession).visitor_name || "Visitor"}`);
          } else if (payload.eventType === "UPDATE") {
            setSessions((prev) =>
              prev.map((s) => (s.id === payload.new.id ? (payload.new as ChatSession) : s))
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Realtime: listen for new messages in active session
  useEffect(() => {
    if (!activeSessionId) return;
    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel(`admin_chat_messages_${activeSessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${activeSessionId}`,
        },
        (payload) => {
          const incoming = payload.new as ChatMessage;

          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, incoming];
          });

          if (incoming.sender_type === "user") {
            markSessionAsRead(activeSessionId);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeSessionId, markSessionAsRead]);

  // Load messages when selecting a session
  const selectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setDraft("");
    try {
      const res = await fetch(`/api/chat?session_id=${sessionId}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
      markSessionAsRead(sessionId);
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  };

  const sendAdminMessage = async () => {
    if (!draft.trim() || !activeSessionId || isSending) return;
    const content = draft.trim();
    setDraft("");
    setIsSending(true);

    // Optimistic
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: activeSessionId,
      sender_type: "admin",
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
          session_id: activeSessionId,
          content,
          sender_type: "admin",
        }),
      });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const closeSession = async (sessionId: string) => {
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "close_session", session_id: sessionId }),
      });
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: "closed" as const } : s))
      );
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
      toast.success("Chat closed");
    } catch {
      toast.error("Failed to close chat");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAdminMessage();
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="absolute inset-0 flex">
      {/* Sessions Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-white/10 bg-[#00000080] backdrop-blur-xl flex flex-col">
        <div className="p-5 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-serif text-white tracking-wide">Conversations</h2>
          <div className="flex gap-1 mt-3">
            {(["active", "closed", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full font-medium uppercase tracking-wider transition-all ${
                  filter === f
                    ? "bg-[var(--primary)] text-white"
                    : "bg-white/5 text-white/40 hover:text-white/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredSessions.length === 0 && (
            <div className="p-8 text-center text-white/30 text-sm">
              No {filter} conversations
            </div>
          )}
          {filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <button
                key={session.id}
                onClick={() => selectSession(session.id)}
                className={`w-full text-left px-5 py-4 border-b border-white/5 transition-all ${
                  isActive
                    ? "bg-[rgba(var(--primary-rgb),0.1)] border-l-2 border-l-[var(--primary)]"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${session.status === "active" ? "bg-green-500" : "bg-white/20"}`} />
                    <span className="text-sm text-white/90 font-medium truncate">
                      {session.visitor_name || "Visitor"}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/30 shrink-0 ml-2">
                    {new Date(session.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-white/40 truncate">
                    {new Date(session.created_at).toLocaleDateString()}
                  </span>
                  {session.unread_count > 0 && (
                    <span className="bg-[var(--primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {session.unread_count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeSession ? (
          <>
            {/* Thread Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#00000040] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {activeSession.visitor_name || "Visitor"}
                  </h3>
                  <p className="text-[11px] text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Started {new Date(activeSession.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {activeSession.status === "active" && (
                <button
                  onClick={() => closeSession(activeSession.id)}
                  className="px-3 py-1.5 text-xs bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/50 border border-white/10 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Archive className="w-3 h-3" /> Close Chat
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender_type === "admin"
                        ? "bg-[var(--primary)] text-white rounded-br-md"
                        : msg.sender_type === "system"
                        ? "bg-white/5 text-white/50 italic text-xs rounded-lg"
                        : "bg-white/10 text-white/90 rounded-bl-md"
                    }`}
                  >
                    {msg.sender_type === "user" && (
                      <span className="text-[10px] text-white/40 block mb-1">
                        {activeSession.visitor_name || "Visitor"}
                      </span>
                    )}
                    {msg.content}
                    <span className="block text-[9px] mt-1 opacity-50 text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Admin Reply Input */}
            {activeSession.status === "active" && (
              <div className="p-4 border-t border-white/10 bg-[#08080a] shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Reply to visitor..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:border-[var(--primary)] outline-none transition-colors"
                  />
                  <button
                    onClick={sendAdminMessage}
                    disabled={!draft.trim() || isSending}
                    className="p-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-40 rounded-xl text-white transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-lg font-serif text-white/40">Select a conversation</h3>
            <p className="text-sm text-white/20 mt-2 max-w-sm">
              Choose a chat from the sidebar to view messages and reply to visitors in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
