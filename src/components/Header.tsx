"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";

const navServices = [
  { slug: "wedding", name: "Wedding Packages" },
  { slug: "quinceanera", name: "Quinceañera" },
  { slug: "night-parties", name: "Night Out Parties" },
  { slug: "prom", name: "Prom Night" },
  { slug: "bachelor-bachelorette", name: "Bachelor & Bachelorette" },
  { slug: "concerts-sports", name: "Concerts & Sports Events" },
  { slug: "birthday", name: "Birthday Celebrations" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMobileOpen(false);
      setServicesOpen(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  const closeMenus = () => {
    setMobileOpen(false);
    setServicesOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center" aria-label="Avital Chicago home">
          <Image
            src="/images/logos/logo.webp"
            alt="Avital Chicago logo"
            width={174}
            height={45}
            priority
            className="shrink-0"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/chicago-limo-rental" className="nav-link">
            Limo Fleet
          </Link>
          <Link href="/chicago-party-bus-rental" className="nav-link">
            Party Buses
          </Link>

          <div className="group relative">
            <button className="nav-link flex items-center gap-1">
              Services <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute left-0 top-full pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
              <div
                className="glass-card min-w-[220px] p-3"
                style={{ background: "rgba(20,20,24,0.95)" }}
              >
                {navServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    onClick={closeMenus}
                    className="block rounded-md px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                  >
                    {service.name}
                  </Link>
                ))}
                <Link
                  href="/services"
                  onClick={closeMenus}
                  className="block px-4 py-2.5 text-sm font-medium text-primary"
                >
                  All Services {"->"}
                </Link>
              </div>
            </div>
          </div>

          <Link href="/areas-we-serve" className="nav-link">
            Areas
          </Link>
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <Link href="/contact-us" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:6305506753"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4 text-primary" />
            (630) 550-6753
          </a>
          <Link href="/contact-us" className="btn-primary px-5 py-2.5 text-[11px]">
            Get a Quote
          </Link>
        </div>

        <button
          className="p-2 text-foreground lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`fixed inset-x-0 top-20 z-40 transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "rgba(12,12,14,0.98)",
          backdropFilter: "blur(20px)",
        }}
      >
        <nav className="flex min-h-[calc(100vh-5rem)] flex-col gap-1 p-8">
          <Link
            href="/"
            onClick={closeMenus}
            className="border-b border-border py-3 text-lg text-foreground"
          >
            Home
          </Link>
          <Link
            href="/chicago-limo-rental"
            onClick={closeMenus}
            className="border-b border-border py-3 text-lg text-foreground"
          >
            Limo Fleet
          </Link>
          <Link
            href="/chicago-party-bus-rental"
            onClick={closeMenus}
            className="border-b border-border py-3 text-lg text-foreground"
          >
            Party Buses
          </Link>

          <button
            onClick={() => setServicesOpen((open) => !open)}
            className="flex items-center justify-between border-b border-border py-3 text-left text-lg text-foreground"
          >
            Services
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                servicesOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {servicesOpen && (
            <div className="pb-2 pl-4">
              {navServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onClick={closeMenus}
                  className="block py-2 text-muted-foreground"
                >
                  {service.name}
                </Link>
              ))}
              <Link
                href="/services"
                onClick={closeMenus}
                className="block py-2 font-medium text-primary"
              >
                All Services {"->"}
              </Link>
            </div>
          )}

          <Link
            href="/areas-we-serve"
            onClick={closeMenus}
            className="border-b border-border py-3 text-lg text-foreground"
          >
            Areas
          </Link>
          <Link
            href="/blog"
            onClick={closeMenus}
            className="border-b border-border py-3 text-lg text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/contact-us"
            onClick={closeMenus}
            className="border-b border-border py-3 text-lg text-foreground"
          >
            Contact
          </Link>

          <div className="mt-6 flex flex-col gap-4">
            <a href="tel:6305506753" className="flex items-center gap-2 text-foreground">
              <Phone className="h-5 w-5 text-primary" /> (630) 550-6753
            </a>
            <Link
              href="/contact-us"
              onClick={closeMenus}
              className="btn-primary justify-center text-center"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
