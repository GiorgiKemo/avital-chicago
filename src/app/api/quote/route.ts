import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const quoteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  pickUp: z.string().optional(),
  dropOff: z.string().optional(),
  passengers: z.string().optional(),
  date: z.string().optional(),
  eventType: z.string().optional(),
  serviceType: z.string().optional(),
  vehicleType: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please fill in the required quote form fields correctly." },
      { status: 400 }
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      {
        message:
          "Quote backend is not configured yet. Please call (630) 550-6753 while we finish the Supabase setup.",
      },
      { status: 503 }
    );
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase admin client is unavailable." },
      { status: 500 }
    );
  }

  const { error } = await supabase.from("quote_submissions").insert({
    full_name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    pickup_location: parsed.data.pickUp || null,
    dropoff_location: parsed.data.dropOff || null,
    passengers: parsed.data.passengers ? Number(parsed.data.passengers) : null,
    event_date: parsed.data.date || null,
    event_type: parsed.data.eventType || null,
    service_type: parsed.data.serviceType || null,
    vehicle_type: parsed.data.vehicleType || null,
  });

  if (error) {
    return NextResponse.json(
      { message: "We could not save your quote request yet. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Quote request accepted.",
  });
}
