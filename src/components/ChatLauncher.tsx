"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircleMore } from "lucide-react";

type TidioApi = {
  hide: () => void;
  show: () => void;
  open: () => void;
  on: (event: string, callback: () => void) => void;
};

declare global {
  interface Window {
    tidioChatApi?: TidioApi;
  }
}

export default function ChatLauncher() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const configuredRef = useRef(false);
  const pendingOpenRef = useRef(false);

  useEffect(() => {
    const configureWidget = () => {
      if (configuredRef.current) {
        return;
      }

      const api = window.tidioChatApi;
      if (!api) {
        return;
      }

      configuredRef.current = true;
      api.hide();
      api.on("close", () => {
        setOpen(false);
        api.hide();
      });
      setReady(true);

      if (pendingOpenRef.current) {
        pendingOpenRef.current = false;
        setOpen(true);
        api.show();
        api.open();
      }
    };

    configureWidget();
    const pollTimer = window.setInterval(configureWidget, 500);
    document.addEventListener("tidioChat-ready", configureWidget);

    return () => {
      window.clearInterval(pollTimer);
      document.removeEventListener("tidioChat-ready", configureWidget);
    };
  }, []);

  const openChat = () => {
    const api = window.tidioChatApi;
    if (!api) {
      pendingOpenRef.current = true;
      return;
    }

    setOpen(true);
    api.show();
    api.open();
  };

  if (open) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openChat}
      aria-label="Open live chat"
      aria-busy={!ready}
      className={`fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_16px_36px_rgba(244,56,136,0.38)] transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background ${
        ready
          ? "hover:scale-[1.03] hover:bg-primary/90"
          : "opacity-85"
      }`}
    >
      <MessageCircleMore className="h-6 w-6" />
    </button>
  );
}
