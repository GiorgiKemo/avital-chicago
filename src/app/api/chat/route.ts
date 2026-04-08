import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/admin-auth";

// POST: Create a new chat session or send a message
export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Create a new session
  if (body.action === "create_session") {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        visitor_name: body.visitor_name || "Visitor",
        visitor_email: body.visitor_email || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Insert a system welcome message
    await supabase.from("chat_messages").insert({
      session_id: data.id,
      sender_type: "system",
      content: "Welcome to Avital Chicago! How can we help you today?",
    });

    return NextResponse.json({ session: data });
  }

  // Send a message
  if (body.action === "send_message") {
    if (!body.session_id || !body.content) {
      return NextResponse.json({ error: "Missing session_id or content" }, { status: 400 });
    }

    const senderType = body.sender_type || "user";

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: body.session_id,
        sender_type: senderType,
        content: body.content.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update session timestamp
    await supabase
      .from("chat_sessions")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", body.session_id);

    return NextResponse.json({ message: data });
  }

  // Close a session
  if (body.action === "close_session") {
    if (!body.session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("chat_sessions")
      .update({ status: "closed" })
      .eq("id", body.session_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (body.action === "mark_read") {
    if (!body.session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const { user, isAdmin } = await getAdminSession();
    if (!user || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("chat_sessions")
      .update({ unread_count: 0 })
      .eq("id", body.session_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// GET: Fetch messages for a session
export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}
