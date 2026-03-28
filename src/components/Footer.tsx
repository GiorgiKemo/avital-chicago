import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const services = [
  { slug: "wedding", name: "Wedding Packages" },
  { slug: "quinceanera", name: "Quinceañera" },
  { slug: "night-parties", name: "Night Out Parties" },
  { slug: "prom", name: "Prom Night" },
  { slug: "bachelor-bachelorette", name: "Bachelor & Bachelorette" },
  { slug: "concerts-sports", name: "Concerts & Sports" },
  { slug: "birthday", name: "Birthday Celebrations" },
  { slug: "graduation", name: "Graduation" },
  { slug: "kids-party-bus", name: "Kids Party Bus" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0c] pb-8 pt-20">
      <div className="gradient-divider mb-16" />

      <div className="container mx-auto px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 inline-flex" aria-label="Avital Chicago home">
              <Image
                src="/images/logos/logo-footer.webp"
                alt="Avital Chicago logo"
                width={207}
                height={47}
                className="h-auto w-[176px]"
                style={{ height: "auto" }}
              />
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Chicago&apos;s premier luxury limousine and party bus rental service.
              Making every journey unforgettable.
            </p>
            <a
              href="https://www.facebook.com/avitallimo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowUpRight className="h-4 w-4" /> Follow us on Facebook
            </a>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-foreground">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/chicago-limo-rental"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Limo Fleet
              </Link>
              <Link
                href="/chicago-party-bus-rental"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Party Bus Fleet
              </Link>
              <Link
                href="/charter-buses"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Charter Buses
              </Link>
              <Link
                href="/areas-we-serve"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Areas We Serve
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/contact-us"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-foreground">
              Services
            </h4>
            <nav className="flex flex-col gap-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {service.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-foreground">
              Contact
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">
                  1431 Harmony Ct, Itasca, IL 60143
                </span>
              </div>
              <a
                href="tel:6305506753"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                (630) 550-6753
              </a>
              <a
                href="mailto:info@avitalchicagolimousine.com"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                info@avitalchicagolimousine.com
              </a>
              <p className="text-sm text-muted-foreground">Mon-Sat: 9AM - 10PM</p>
            </div>
          </div>
        </div>

        <div className="gradient-divider mb-6" />
        <p className="text-center text-xs text-muted-foreground">
          {"\u00A9"} {new Date().getFullYear()} Avital Chicago Limousine And Party Bus.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
