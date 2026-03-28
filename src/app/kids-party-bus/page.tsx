import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone, Shield } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import QuoteForm from "@/components/QuoteForm";
import {
  kidsEventLinks,
  kidsFaqs,
  kidsFleetCrossLinks,
  kidsHighlights,
  kidsIntroParagraphs,
  kidsLimoFleet,
  kidsPartyBusFleet,
  kidsRelatedBlogSlugs,
  kidsWhyChoose,
  parentReasons,
} from "@/lib/kids-page-content";
import { blogPosts } from "@/lib/site-data";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Kids Party Bus",
  description:
    "Safe, high-energy kids party bus experiences for birthdays and private celebrations across Chicagoland.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function KidsPartyBusPage() {
  const relatedPosts = blogPosts.filter((post) =>
    kidsRelatedBlogSlugs.includes(post.slug),
  );

  return (
    <>
      <JsonLd
        id="kids-party-bus-breadcrumb-schema"
        data={buildBreadcrumbJsonLd([
          { name: "Avital Limousine and Party Bus", item: "/" },
          { name: "Kids Party Bus", item: "/kids-party-bus" },
        ])}
      />

      <section className="relative overflow-hidden pb-14 pt-28">
        <Image
          src="/images/kids/KidsHome.webp"
          alt="Kids party bus rental in Chicago"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/96 via-background/82 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
        <div className="container relative z-10 mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div>
              <p className="pink-label mb-4">Kids Party Bus</p>
              <h1 className="max-w-4xl font-serif text-5xl leading-none text-foreground md:text-7xl">
                Kids Party Bus Rental in Chicago
              </h1>
              <div className="mt-6 max-w-3xl space-y-4 text-lg text-muted-foreground">
                {kidsIntroParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {kidsHighlights.map((item) => (
                  <div key={item.title} className="glass-card p-5">
                    <h2 className="mb-2 font-serif text-2xl text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {kidsFleetCrossLinks.map((item) => (
              <div key={item.href} className="glass-card p-8">
                <p className="pink-label mb-3">Explore More</p>
                <h2 className="mb-3 font-serif text-3xl text-foreground">
                  {item.title}
                </h2>
                <p className="mb-6 text-muted-foreground">{item.description}</p>
                <Link href={item.href} className="btn-outline">
                  {item.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center">
            <div className="glass-card p-8 md:p-10">
              <p className="pink-label mb-3">Fleet Categories</p>
              <h2 className="mb-5 font-serif text-4xl text-foreground">
                Our Two Major Vehicle Categories for Kids Events
              </h2>

              <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-serif text-3xl text-foreground">
                    Limo Fleet
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Stretch limos work well when families want a more polished
                    arrival, smaller group atmosphere, or a vehicle that feels a
                    little more formal.
                  </p>
                  <div className="space-y-3">
                    {kidsLimoFleet.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-3 rounded-2xl border border-border bg-card/15 px-4 py-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-serif text-3xl text-foreground">
                    Party Bus Fleet
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Party buses open up more room, more energy, and more ways to
                    make the ride itself part of the event.
                  </p>
                  <div className="space-y-3">
                    {kidsPartyBusFleet.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-3 rounded-2xl border border-border bg-card/15 px-4 py-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="image-hover-zoom relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/kids/Test2.webp"
                alt="Kids party bus interior"
                fill
                quality={95}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="glass-card p-8 md:p-10">
            <p className="pink-label mb-3">Event Coverage</p>
            <h2 className="mb-4 font-serif text-4xl text-foreground">
              Kids Events We Can Help Support
            </h2>
            <p className="max-w-3xl text-muted-foreground">
              The old page focused on birthdays first, but it also tied the kids
              experience into school events, milestone celebrations, and
              supervised group outings that still wanted a luxury arrival.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kidsEventLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-border bg-card/15 px-5 py-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="block font-medium text-foreground">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] lg:items-center">
            <div className="image-hover-zoom relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/kids/Test3.webp"
                alt="Kids party bus event experience"
                fill
                quality={95}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
            </div>

            <div className="glass-card p-8 md:p-10">
              <p className="pink-label mb-3">Why Parents Book It</p>
              <h2 className="mb-5 font-serif text-4xl text-foreground">
                Why Parents Choose Party Buses for Kids Birthdays
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {parentReasons.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-card/15 p-5"
                  >
                    <h3 className="mb-2 font-serif text-2xl text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="glass-card-glow p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <p className="pink-label mb-3">Why Avital</p>
                <h2 className="mb-5 font-serif text-4xl text-foreground">
                  Why Families Choose Avital for Kids Parties
                </h2>
                <div className="space-y-4">
                  {kidsWhyChoose.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border bg-background/20 px-5 py-5"
                    >
                      <h3 className="mb-2 font-serif text-2xl text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card/15 p-6">
                <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  Booking Support
                </div>
                <p className="text-muted-foreground">
                  Tell us the date, pickup area, passenger count, and the type of
                  celebration you are planning. We&apos;ll help narrow the fleet to
                  the vehicles that actually fit the event.
                </p>
                <div className="mt-6 flex flex-col gap-3">
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
                  Planning Tips for Families and Events
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
                      quality={95}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {formatDate(post.date)}
                    </p>
                    <h3 className="mb-2 font-serif text-2xl text-foreground transition-colors group-hover:text-primary">
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
              Questions About Kids Party Bus Bookings
            </h2>
          </div>

          <div className="space-y-4">
            {kidsFaqs.map((faq) => (
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
