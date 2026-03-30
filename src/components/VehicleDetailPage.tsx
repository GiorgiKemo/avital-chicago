import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Phone,
  Users,
  Video,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ManagedGalleryGrid from "@/components/ManagedGalleryGrid";
import ManagedImage from "@/components/ManagedImage";
import QuoteForm from "@/components/QuoteForm";
import VehicleCard from "@/components/VehicleCard";
import { cleanLegacyList, cleanLegacyText } from "@/lib/clean-legacy-text";
import { getLegacyVehicleDetail } from "@/lib/legacy-vehicle-details";
import { getVehicleHeroSlotKey, getVehiclePageKey } from "@/lib/site-media-slots";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import type { Vehicle } from "@/types";

interface VehicleDetailPageProps {
  basePath: string;
  backLabel: string;
  fleetLabel: string;
  vehicle: Vehicle;
  relatedVehicles: Vehicle[];
}

const partyBusUseCases = [
  { href: "/services/wedding", label: "Weddings" },
  { href: "/services/quinceanera", label: "Quinceañeras" },
  { href: "/services/night-parties", label: "Night Parties" },
  { href: "/services/prom", label: "Prom & Homecoming" },
  { href: "/services/bachelor-bachelorette", label: "Bachelor & Bachelorette" },
  { href: "/services/birthday", label: "Birthdays" },
];

const limoUseCases = [
  { href: "/services/wedding", label: "Wedding Arrivals" },
  { href: "/services/prom", label: "Prom Nights" },
  { href: "/services/bachelor-bachelorette", label: "Celebrations" },
  { href: "/services/night-parties", label: "Night Out Service" },
  { href: "/services/concerts-sports", label: "Concerts & Sports" },
  { href: "/contact-us", label: "Executive Events" },
];

export default function VehicleDetailPage({
  basePath,
  backLabel,
  fleetLabel,
  vehicle,
  relatedVehicles,
}: VehicleDetailPageProps) {
  const legacyDetail = getLegacyVehicleDetail(vehicle.slug);
  const heroImage =
    vehicle.images[0] || "/images/gallery/cadillac-escalade/exterior/01.webp";
  const gallery = vehicle.images.slice(1, 13);
  const galleryCount = vehicle.images.length;
  const legacyFeatures = cleanLegacyList(legacyDetail?.featureList);
  const features = legacyFeatures.length > 0 ? legacyFeatures : vehicle.features;
  const legacyParagraphs = cleanLegacyList(legacyDetail?.descriptionParagraphs);
  const overviewParagraphs =
    legacyParagraphs.length > 0 ? legacyParagraphs : [vehicle.description];
  const featureHeading = cleanLegacyText(legacyDetail?.featureHeading);
  const useCases = vehicle.type === "party-bus" ? partyBusUseCases : limoUseCases;
  const pageKey = getVehiclePageKey(basePath, vehicle.slug);

  return (
    <>
      <JsonLd
        id={`${vehicle.slug}-breadcrumb-schema`}
        data={buildBreadcrumbJsonLd([
          { name: "Avital Limousine and Party Bus", item: "/" },
          { name: fleetLabel, item: basePath },
          { name: vehicle.name, item: `${basePath}/${vehicle.slug}` },
        ])}
      />

      <section className="relative min-h-[100svh] overflow-hidden pb-8 pt-28 lg:flex lg:items-center lg:pb-6">
        <div className="container mx-auto w-full px-6">
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
            <div>
              <p className="pink-label mb-4">{fleetLabel}</p>
              <h1 className="max-w-4xl font-serif text-5xl leading-none text-foreground md:text-7xl">
                {vehicle.name}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                {cleanLegacyText(vehicle.tagline)}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="glass-card px-5 py-4">
                  <p className="font-serif text-3xl text-foreground">
                    {vehicle.passengers}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Max Passengers
                  </p>
                </div>
                <div className="glass-card px-5 py-4">
                  <p className="font-serif text-3xl text-foreground">
                    {galleryCount}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Real Gallery Photos
                  </p>
                </div>
                <div className="glass-card px-5 py-4">
                  <p className="font-serif text-3xl text-foreground">
                    {vehicle.type === "party-bus" ? "Party Bus" : "Stretch Limo"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Vehicle Class
                  </p>
                </div>
              </div>

              <div className="image-hover-zoom relative mt-8 aspect-[16/10] overflow-hidden rounded-3xl border border-border">
                <ManagedImage
                  slotKey={getVehicleHeroSlotKey(basePath, vehicle.slug)}
                  fallbackSrc={heroImage}
                  fallbackAlt={vehicle.name}
                  fill
                  priority
                  quality={95}
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
            </div>

            <div className="lg:pt-0">
              <QuoteForm compact />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="glass-card p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <p className="pink-label mb-3">Vehicle Overview</p>
                <h2 className="mb-4 font-serif text-4xl text-foreground">
                  {cleanLegacyText(legacyDetail?.pageTitle) || `${vehicle.name} Details`}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  {overviewParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card/15 p-6">
                <p className="pink-label mb-3">Best For</p>
                <div className="grid gap-3">
                  {useCases.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-background/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Calendar className="h-4 w-4 shrink-0 text-primary" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <p className="pink-label mb-3">Gallery</p>
            <h2 className="font-serif text-4xl text-foreground">
              Real Images of {vehicle.name}
            </h2>
          </div>

          <ManagedGalleryGrid
            pageKey={pageKey}
            pageLabel={vehicle.name}
            fallbackImages={gallery}
          />
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="glass-card p-8 md:p-10">
            <p className="pink-label mb-3">Features & Amenities</p>
            <h2 className="mb-5 font-serif text-4xl text-foreground">
              {featureHeading || `${vehicle.name} Features`}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card/15 px-4 py-4 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {legacyDetail?.youtubeId || overviewParagraphs.length > 1 ? (
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] lg:items-start">
              {legacyDetail?.youtubeId ? (
                <div className="glass-card overflow-hidden p-4">
                  <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    <Video className="h-4 w-4 text-primary" />
                    Vehicle Walkthrough
                  </div>
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
                    <iframe
                      src={`https://www.youtube.com/embed/${legacyDetail.youtubeId}`}
                      title={`${vehicle.name} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>
              ) : null}

              <div className="glass-card p-8 md:p-10">
                <p className="pink-label mb-3">Why People Book It</p>
                <h2 className="mb-5 font-serif text-4xl text-foreground">
                  A Better Look at {vehicle.name}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  {overviewParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {relatedVehicles.length > 0 ? (
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="pink-label mb-3">Same Fleet</p>
                <h2 className="font-serif text-4xl text-foreground">
                  Explore Related Vehicles
                </h2>
              </div>
              <Link
                href={basePath}
                className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-foreground"
              >
                View Full Fleet <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedVehicles.map((relatedVehicle) => (
                <VehicleCard
                  key={relatedVehicle.slug}
                  vehicle={relatedVehicle}
                  basePath={basePath}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="glass-card-glow p-8 md:p-10">
            <p className="pink-label mb-3">Book This Vehicle</p>
            <h2 className="mb-5 font-serif text-4xl text-foreground">
              Ready to Reserve {vehicle.name}?
            </h2>
            <p className="max-w-3xl text-muted-foreground">
              Tell us about your date, guest count, and route, and we&apos;ll help
              confirm whether {vehicle.name} is the right fit or point you to the
              strongest alternatives in the fleet.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact-us" className="btn-primary">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:6305506753" className="btn-outline">
                <Phone className="h-4 w-4" />
                Call (630) 550-6753
              </a>
              <div className="glass-card flex items-center gap-3 px-5 py-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Seats up to {vehicle.passengers} passengers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
