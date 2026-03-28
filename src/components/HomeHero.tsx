"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Star, Users } from "lucide-react";
import ManagedImage from "@/components/ManagedImage";

const heroImages = [
  {
    slotKey: "home.hero.1",
    src: "/images/hero/hero-limo.webp",
    alt: "White limousine at night in downtown Chicago",
    position: "center center",
  },
  {
    slotKey: "home.hero.2",
    src: "/images/hero/partybus-interior.webp",
    alt: "Luxury party bus interior with purple lighting",
    position: "center center",
  },
  {
    slotKey: "home.hero.3",
    src: "/images/hero/hero-partybus.webp",
    alt: "Black party bus in downtown Chicago at night",
    position: "center center",
  },
];

const heroStats = [
  {
    icon: Calendar,
    label: "500+",
    sub: "Events",
  },
  {
    icon: Users,
    label: "50",
    sub: "Max Passengers",
  },
  {
    icon: Star,
    label: "5.0",
    sub: "Star Rating",
  },
];

export default function HomeHero() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {heroImages.map((image, index) => (
        <div
          key={image.src}
          className="absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: index === heroIndex ? 1 : 0,
            transform: index !== heroIndex ? "scale(1)" : "scale(1.035)",
          }}
        >
          <ManagedImage
            slotKey={image.slotKey}
            fallbackSrc={image.src}
            fallbackAlt={image.alt}
            fill
            priority={index === 0}
            quality={95}
            className="object-cover"
            style={{ objectPosition: image.position }}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/72 to-background/38" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,20,90,0.16),transparent_32%)]" />
      <div className="blur-orb bottom-0 left-1/4 h-[500px] w-[500px]" />

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-12 px-6">
        <div>
          <p className="pink-label mb-6">Chicago&apos;s Premier Transportation</p>
          <h1 className="mb-8 font-serif text-6xl font-semibold leading-[0.98] md:text-7xl lg:text-[6.75rem]">
            Luxury
            <br />
            <span className="gradient-text font-bold">Party Bus</span>
            <br />& Limousine
          </h1>

          <div className="mb-10 flex flex-wrap gap-6">
            {heroStats.map((badge) => (
              <div
                key={badge.sub}
                className="glass-card flex items-center gap-3 px-5 py-3"
              >
                <badge.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-lg font-semibold leading-none text-foreground">
                    {badge.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <Link href="/chicago-party-bus-rental" className="btn-primary">
                Explore Fleet <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              <a href="tel:6305506753" className="btn-outline">
                Call Now <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
