"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Image as ImageIcon,
  LayoutDashboard,
  MessageCircle,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type AdminTopNavProps = {
  initialNewQuotesCount: number;
  initialUnreadChatCount: number;
};

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: "quotes" | "chat";
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Quotes", href: "/admin/quotes", icon: Briefcase, badge: "quotes" },
  { label: "Chat", href: "/admin/chat", icon: MessageCircle, badge: "chat" },
  { label: "Media Manager", href: "/admin/media", icon: ImageIcon },
  { label: "Appearance", href: "/admin/appearance", icon: Palette },
];

function isRouteActive(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  if (href === "/admin") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

function clampCount(count: number) {
  return count > 99 ? "99+" : String(Math.max(0, count));
}

export default function AdminTopNav({
  initialNewQuotesCount,
  initialUnreadChatCount,
}: AdminTopNavProps) {
  const pathname = usePathname();
  const [newQuotesCount, setNewQuotesCount] = useState(initialNewQuotesCount);
  const [unreadChatCount, setUnreadChatCount] = useState(initialUnreadChatCount);

  useEffect(() => {
    let supabase;

    try {
      supabase = getSupabaseBrowser();
    } catch {
      return;
    }

    const quoteChannel = supabase
      .channel("admin_nav_quote_counts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quote_submissions",
        },
        (payload) => {
          const previousStatus =
            payload.eventType === "UPDATE" || payload.eventType === "DELETE"
              ? payload.old.status
              : null;
          const nextStatus =
            payload.eventType === "INSERT" || payload.eventType === "UPDATE"
              ? payload.new.status
              : null;

          setNewQuotesCount((current) => {
            if (previousStatus !== "new" && nextStatus === "new") {
              return current + 1;
            }

            if (previousStatus === "new" && nextStatus !== "new") {
              return Math.max(0, current - 1);
            }

            return current;
          });
        },
      )
      .subscribe();

    const chatChannel = supabase
      .channel("admin_nav_chat_counts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_sessions",
        },
        (payload) => {
          const previousUnread =
            payload.eventType === "UPDATE" || payload.eventType === "DELETE"
              ? Number(payload.old.unread_count || 0)
              : 0;
          const nextUnread =
            payload.eventType === "INSERT" || payload.eventType === "UPDATE"
              ? Number(payload.new.unread_count || 0)
              : 0;
          const previousHasUnread = previousUnread > 0;
          const nextHasUnread = nextUnread > 0;

          setUnreadChatCount((current) => {
            if (!previousHasUnread && nextHasUnread) {
              return current + 1;
            }

            if (previousHasUnread && !nextHasUnread) {
              return Math.max(0, current - 1);
            }

            return current;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quoteChannel);
      supabase.removeChannel(chatChannel);
    };
  }, []);

  return (
    <nav className="flex items-center gap-6">
      {MENU_ITEMS.map((item) => {
        const active = isRouteActive(pathname, item.href);
        const showQuoteBadge = item.badge === "quotes" && newQuotesCount > 0;
        const showChatBadge = item.badge === "chat" && unreadChatCount > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-2 text-sm font-medium transition-colors ${
              active ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            <span className="relative">
              <item.icon
                className={`h-4 w-4 transition-opacity ${
                  active ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                }`}
              />
              {showChatBadge ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4145a]/80" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#d4145a]" />
                </span>
              ) : null}
            </span>

            <span className="hidden md:block">{item.label}</span>

            {showQuoteBadge ? (
              <span className="hidden min-w-5 rounded-full bg-[#d4145a] px-1.5 py-0.5 text-center text-[10px] font-semibold text-white md:inline-block">
                {clampCount(newQuotesCount)}
              </span>
            ) : null}
          </Link>
        );
      })}

      <Link
        href="/"
        className="ml-4 flex items-center gap-2 border-l border-white/10 pl-6 text-sm font-medium text-[#d4145a] transition-colors hover:text-white"
      >
        Exit Admin
      </Link>
    </nav>
  );
}
