import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import QuoteForm from "@/components/QuoteForm";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    value: "1431 Harmony Ct, Itasca, IL 60143",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "(630) 550-6753",
    href: "tel:6305506753",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@avitalchicagolimousine.com",
    href: "mailto:info@avitalchicagolimousine.com",
  },
  {
    icon: Clock,
    title: "Hours",
    value: "Mon-Sat: 9AM - 10PM",
  },
];

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Avital Chicago Limousine for quotes, fleet questions, and event transportation planning.",
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        id="contact-breadcrumb-schema"
        data={buildBreadcrumbJsonLd([
          { name: "Avital Limousine and Party Bus", item: "/" },
          { name: "Contact Us", item: "/contact-us" },
        ])}
      />

      <PageHeader
        label="Contact Us"
        title={
          <>
            Get in <span className="gradient-text font-semibold">Touch</span>
          </>
        }
        subtitle="Reach out for a free quote, fleet recommendations, or help planning transportation for your event."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => (
              <div key={item.title} className="glass-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-1 font-medium text-foreground">{item.title}</h2>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch">
            <div className="glass-card h-[400px] overflow-hidden rounded-xl lg:h-auto lg:flex-1">
              <iframe
                src="https://www.google.com/maps?q=1431+Harmony+Ct,+Itasca,+IL+60143&z=14&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Avital Chicago Limousine location"
              />
            </div>

            <QuoteForm className="lg:flex-1" />
          </div>
        </div>
      </section>
    </>
  );
}
