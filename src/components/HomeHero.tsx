"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Star, Users } from "lucide-react";
import ManagedImage from "@/components/ManagedImage";
import FadeIn from "@/components/FadeIn";

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
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === heroIndex ? 1 : 0,
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

      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,20,90,0.1),transparent_50%)]" />

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-12 px-6">
        <div className="max-w-4xl">
          <FadeIn delay={0.1}>
            <p className="pink-label mb-6 border-l-2 border-primary pl-4 tracking-[0.3em]">Chicago&apos;s Premier Transportation</p>
            <h1 className="mb-8 font-serif text-6xl font-light leading-[1] md:text-7xl lg:text-[7rem]">
              Luxury
              <br />
              <span className="gradient-text font-bold">Party Bus</span>
              <br />& Limousine
            </h1>
          </FadeIn>

          <div className="mb-12 flex flex-wrap gap-8">
            {heroStats.map((badge, index) => (
              <FadeIn key={badge.sub} delay={0.2 + index * 0.1}>
                <div
                  className="flex items-center gap-4 py-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center border border-border/50 bg-card/20 backdrop-blur-sm">
                    <badge.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-serif leading-none tracking-tight text-foreground">
                      {badge.label}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{badge.sub}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
