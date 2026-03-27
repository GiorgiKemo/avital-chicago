import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Your request has been received. An Avital Chicago advisor will be in touch as soon as possible.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <>
      <PageHeader
        label="Thank You"
        title={
          <>
            We Received Your{" "}
            <span className="gradient-text font-semibold">Request</span>
          </>
        }
        subtitle="Your request will be passed to one of our expert advisors, who will be in contact as soon as possible."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl glass-card-glow p-8 text-center md:p-12">
            <h2 className="mb-4 font-serif text-3xl text-foreground">
              Thank You!
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              We appreciate your interest in Avital Chicago Limousine and Party
              Bus. If your event is coming up soon, feel free to call us
              directly for faster assistance.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="btn-primary">
                Back to Home <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:6305506753" className="btn-outline">
                <Phone className="h-4 w-4" /> (630) 550-6753
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
