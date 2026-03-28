import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Check, Phone } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ManagedImage from "@/components/ManagedImage";
import QuoteForm from "@/components/QuoteForm";
import VehicleCard from "@/components/VehicleCard";
import type { FleetLandingContent } from "@/lib/fleet-page-content";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { blogPosts } from "@/lib/site-data";
import type { Vehicle } from "@/types";

interface FleetLandingPageProps {
  basePath: string;
  vehicles: Vehicle[];
  content: FleetLandingContent;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function FleetLandingPage({
  basePath,
  vehicles,
  content,
}: FleetLandingPageProps) {
  const maxPassengers = Math.max(...vehicles.map((vehicle) => vehicle.passengers));
  const relatedPosts = blogPosts.filter((post) =>
    content.relatedPostSlugs.includes(post.slug),
  );
  const pageTitle = `${content.titleLead} ${content.titleAccent} ${content.titleTrail}`.replace(
    /\s+/g,
    " ",
  );
  const fleetSlotPrefix = basePath.includes("party-bus") ? "fleet.party-bus" : "fleet.limo";

  return (
    <>
      <JsonLd
        id={`${basePath.replace(/\//g, "-")}-breadcrumb-schema`}
        data={buildBreadcrumbJsonLd([
          { name: "Avital Limousine and Party Bus", item: "/" },
          { name: pageTitle, item: basePath },
        ])}
      />

      <section className="relative overflow-hidden pb-16 pt-28">
        <ManagedImage
          slotKey={`${fleetSlotPrefix}.hero`}
          fallbackSrc={content.heroImage}
          fallbackAlt={content.heroAlt}
          fill
          priority
          quality={95}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <div className="container relative z-10 mx-auto px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div className="max-w-4xl">
              <p className="pink-label mb-4">{content.label}</p>
              <h1 className="max-w-4xl font-serif text-5xl leading-none text-foreground md:text-7xl">
                {content.titleLead}{" "}
                <span className="gradient-text font-semibold">{content.titleAccent}</span>{" "}
                {content.titleTrail}
              </h1>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {content.introParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="glass-card px-5 py-4">
                  <div className="text-2xl font-semibold text-foreground">
                    {vehicles.length}
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Vehicles Available
                  </p>
                </div>
                <div className="glass-card px-5 py-4">
                  <div className="text-2xl font-semibold text-foreground">
                    {maxPassengers}
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Max Passengers
                  </p>
                </div>
                <div className="glass-card px-5 py-4">
                  <div className="text-2xl font-semibold text-foreground">Chicago</div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    City & Suburbs
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pb-4">
              <QuoteForm compact />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="glass-card p-8 md:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <p className="pink-label mb-3">Event Coverage</p>
                <h2 className="mb-4 font-serif text-4xl text-foreground">
                  {content.useCasesTitle}
                </h2>
                <p className="max-w-3xl text-muted-foreground">
                  {content.useCasesDescription}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {content.useCaseLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card/20 px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="pink-label mb-3">Fleet Overview</p>
              <h2 className="font-serif text-4xl text-foreground">
                {content.fleetHeading}
              </h2>
            </div>
            <p className="max-w-3xl text-muted-foreground">{content.fleetDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} basePath={basePath} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center">
            <div className="glass-card p-8 md:p-10">
              <p className="pink-label mb-3">Legacy Highlights</p>
              <h2 className="mb-5 font-serif text-4xl text-foreground">
                {content.spotlightTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {content.spotlightParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 grid gap-4">
                {content.spotlightFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-border bg-card/20 p-5"
                  >
                    <h3 className="mb-2 font-serif text-2xl text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="image-hover-zoom relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
              <ManagedImage
                slotKey={`${fleetSlotPrefix}.spotlight`}
                fallbackSrc={content.spotlightImage}
                fallbackAlt={content.spotlightAlt}
                fill
                quality={95}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/65 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="glass-card p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <p className="pink-label mb-3">What To Expect</p>
                <h2 className="mb-4 font-serif text-4xl text-foreground">
                  {content.featuresTitle}
                </h2>
                <p className="max-w-3xl text-muted-foreground">
                  {content.featuresDescription}
                </p>
              </div>

              <div className="space-y-3">
                {content.featureBullets.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card/15 px-4 py-4 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {content.crossLinks.map((card) => (
              <div key={card.href} className="glass-card p-8">
                <p className="pink-label mb-3">Explore More</p>
                <h2 className="mb-3 font-serif text-3xl text-foreground">
                  {card.title}
                </h2>
                <p className="mb-6 text-muted-foreground">{card.description}</p>
                <Link href={card.href} className="btn-outline">
                  {card.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {content.pricingTitle && content.pricingImage ? (
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
              <div className="image-hover-zoom relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
                <ManagedImage
                  slotKey={`${fleetSlotPrefix}.pricing`}
                  fallbackSrc={content.pricingImage}
                  fallbackAlt={content.pricingAlt || content.pricingTitle}
                  fill
                  quality={95}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              </div>

              <div className="glass-card p-8 md:p-10">
                <p className="pink-label mb-3">Rates & Booking</p>
                <h2 className="mb-5 font-serif text-4xl text-foreground">
                  {content.pricingTitle}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  {content.pricingParagraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-6 grid gap-3">
                  {content.pricingBullets?.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-card/15 px-4 py-4 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="glass-card-glow p-8 md:p-10">
            <p className="pink-label mb-3">Ready To Book</p>
            <h2 className="mb-5 font-serif text-4xl text-foreground">
              {content.closingTitle}
            </h2>
            <div className="max-w-4xl space-y-4 text-muted-foreground">
              {content.closingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact-us" className="btn-primary">
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:6305506753" className="btn-outline">
                <Phone className="h-4 w-4" />
                Call (630) 550-6753
              </a>
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="pink-label mb-3">From The Blog</p>
                <h2 className="font-serif text-4xl text-foreground">
                  Planning Tips & Inspiration
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-foreground"
              >
                Read More Blogs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group glass-card overflow-hidden"
                >
                  <div className="image-hover-zoom relative aspect-[4/3]">
                    <Image
                      src={
                        post.featuredImage ||
                        "/images/gallery/hummer-h2-triple-axle/exterior/01.webp"
                      }
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.date)}
                    </div>
                    <h3 className="mb-2 font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <p className="pink-label mb-3">FAQs</p>
            <h2 className="font-serif text-4xl text-foreground">
              Questions About Booking
            </h2>
          </div>

          <div className="space-y-4">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="group glass-card px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-foreground">
                  <span>{faq.question}</span>
                  <span className="text-2xl leading-none text-primary transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
