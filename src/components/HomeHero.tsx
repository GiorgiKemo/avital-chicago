"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Star, Users } from "lucide-react";

const heroImages = [
  "/images/hero/hero-partybus.jpg",
  "/images/hero/hero-limo.jpg",
  "/images/hero/partybus-interior.jpg",
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
    <section className="relative flex min-h-[700px] items-center overflow-hidden pt-24">
      {heroImages.map((image, index) => (
        <div
          key={image}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: index === heroIndex ? 1 : 0 }}
        >
          <Image
            src={image}
            alt=""
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
      <div className="blur-orb bottom-0 left-1/4 h-[500px] w-[500px]" />

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="pink-label mb-6">Chicago&apos;s Premier Transportation</p>
          <h1 className="mb-8 font-serif text-5xl font-light leading-[1.05] md:text-6xl lg:text-7xl">
            Luxury
            <br />
            <span className="gradient-text font-semibold">Party Bus</span>
            <br />& Limousine
          </h1>

          <div className="mb-10 flex flex-wrap gap-6">
            {[
              { icon: Calendar, label: "500+", sub: "Events" },
              { icon: Users, label: "50", sub: "Max Passengers" },
              { icon: Star, label: "5.0", sub: "Star Rating" },
            ].map((badge) => (
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
            <Link href="/chicago-party-bus-rental" className="btn-primary">
              Explore Fleet <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:6305506753" className="btn-outline">
              Call Now <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
