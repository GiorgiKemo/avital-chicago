export type QuoteStatus = "new" | "contacted" | "quoted" | "booked" | "lost";

export type QuoteSubmission = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pickup_location: string | null;
  dropoff_location: string | null;
  passengers: number | null;
  event_date: string | null;
  event_type: string | null;
  service_type: string | null;
  vehicle_type: string | null;
  status: QuoteStatus;
  internal_notes: string | null;
  created_at: string;
};
