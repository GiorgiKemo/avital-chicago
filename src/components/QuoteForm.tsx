"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface QuoteFormProps {
  className?: string;
  compact?: boolean;
}

const eventTypes = [
  "Wedding",
  "Bachelor(ette)",
  "Night Party",
  "Concerts",
  "Quinceanera",
  "Prom",
  "Birthday",
  "Other",
];
const serviceTypes = ["Hourly", "Round Trip"];
const vehicleTypes = ["Limousine", "Party Bus", "Charter Bus"];
const defaultForm = {
  name: "",
  email: "",
  phone: "",
  pickUp: "",
  dropOff: "",
  passengers: "",
  date: "",
  eventType: "",
  serviceType: "",
  vehicleType: "",
};

export default function QuoteForm({
  className = "",
  compact = false,
}: QuoteFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const missingRequiredFields = [
      form.name,
      form.email,
      form.phone,
      form.pickUp,
      form.dropOff,
      form.passengers,
      form.eventType,
      form.serviceType,
      form.vehicleType,
    ].some((value) => !value.trim());

    if (missingRequiredFields) {
      toast.error("Please fill in all required fields marked with *.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sourcePage: pathname,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message || "Submission failed");
      }

      if (typeof window !== "undefined") {
        window.gtag_report_conversion?.();
      }

      setForm(defaultForm);
      router.push(payload.redirectTo || "/thank-you");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or call us directly.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20";
  const selectClass = `${inputClass} appearance-none`;

  return (
    <div className={`glass-card-glow p-6 md:p-8 ${className}`}>
      <h3 className="mb-1 font-serif text-2xl font-semibold text-foreground">
        Get a Free Quote
      </h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Fill in your details and we&apos;ll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Full Name *"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          className={inputClass}
          required
        />

        <div
          className={`grid gap-3 ${
            compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClass}
            required
          />
          <input
            type="tel"
            placeholder="Phone *"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div
          className={`grid gap-3 ${
            compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          <input
            type="text"
            placeholder="Pick up Location *"
            value={form.pickUp}
            onChange={(event) => update("pickUp", event.target.value)}
            className={inputClass}
            required
          />
          <input
            type="text"
            placeholder="Drop off Location *"
            value={form.dropOff}
            onChange={(event) => update("dropOff", event.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div
          className={`grid gap-3 ${
            compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          <input
            type="number"
            placeholder="# Passengers *"
            value={form.passengers}
            onChange={(event) => update("passengers", event.target.value)}
            className={inputClass}
            min="1"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(event) => update("date", event.target.value)}
            className={inputClass}
          />
        </div>

        <select
          value={form.eventType}
          onChange={(event) => update("eventType", event.target.value)}
          className={selectClass}
          required
        >
          <option value="">Event Type *</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.serviceType}
            onChange={(event) => update("serviceType", event.target.value)}
            className={selectClass}
            required
          >
            <option value="">Service Type *</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={form.vehicleType}
            onChange={(event) => update("vehicleType", event.target.value)}
            className={selectClass}
            required
          >
            <option value="">Vehicle *</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 w-full justify-center disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request Quote"}{" "}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
