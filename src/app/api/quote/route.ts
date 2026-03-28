import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const quoteSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  pickUp: z.string().trim().min(1),
  dropOff: z.string().trim().min(1),
  passengers: z
    .string()
    .trim()
    .regex(/^[1-9]\d*$/, "Passengers must be a valid number."),
  date: z.string().optional(),
  eventType: z.string().trim().min(1),
  serviceType: z.string().trim().min(1),
  vehicleType: z.string().trim().min(1),
  sourcePage: z.string().trim().optional(),
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
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      {
        message:
          "Our quote system is temporarily unavailable. Please call (630) 550-6753 and we will help you right away.",
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
    redirectTo: "/thank-you",
  });
}
