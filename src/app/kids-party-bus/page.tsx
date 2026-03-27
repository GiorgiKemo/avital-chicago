import type { Metadata } from "next";
import Image from "next/image";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Kids Party Bus",
  description:
    "Safe, high-energy kids party bus experiences for birthdays and private celebrations across Chicagoland.",
};

export default function KidsPartyBusPage() {
  return (
    <>
      <section className="relative min-h-[420px] overflow-hidden pt-28">
        <Image
          src="/images/hero/hero-partybus.jpg"
          alt="Kids party bus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
        <div className="container relative z-10 mx-auto px-6 py-20">
          <p className="pink-label mb-4">Kids Party Bus</p>
          <h1 className="max-w-3xl font-serif text-5xl font-light leading-tight text-foreground">
            Safe, colorful, unforgettable birthday transportation for kids.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Our kids party bus experience gives families a fun private-event
            option with a big reveal, a memorable ride, and room for celebration.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Birthday Energy",
                  desc: "A party-ready atmosphere that makes the ride feel like part of the event.",
                },
                {
                  title: "Group Friendly",
                  desc: "Plenty of room for kids, parents, gifts, and short event-day routes.",
                },
                {
                  title: "Handled by Pros",
                  desc: "Professional chauffeur service and coordinated pickup timing.",
                },
              ].map((item) => (
                <div key={item.title} className="glass-card p-6">
                  <h2 className="mb-2 font-serif text-xl text-foreground">
                    {item.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-8">
              <h2 className="mb-4 font-serif text-2xl text-foreground">
                Planning a kids celebration?
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                We recommend using the quote form to tell us the date, pickup
                area, group size, and the kind of experience you want. From
                birthday entrances to short celebration loops before a venue stop,
                we can help shape the route around your event.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <QuoteForm compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
