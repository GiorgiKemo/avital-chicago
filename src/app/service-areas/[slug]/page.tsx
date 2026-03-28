import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import ManagedImage from "@/components/ManagedImage";
import QuoteForm from "@/components/QuoteForm";
import {
  getLegacyAreaServiceBySlug,
  legacyAreaServices,
} from "@/lib/legacy-area-services";
import { blogPosts, getAreaImage, getAreaSlotKey } from "@/lib/site-data";

export function generateStaticParams() {
  return legacyAreaServices.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const areaService = getLegacyAreaServiceBySlug(slug);

    if (!areaService) {
      return { title: "Area Service Not Found" };
    }

    return {
      title: areaService.pageTitle,
      description: areaService.metaDescription,
    };
  });
}

function SectionCard({
  html,
  className = "",
}: {
  html?: string;
  className?: string;
}) {
  if (!html) {
    return null;
  }

  return (
    <div
      className={`glass-card legacy-blog-content legacy-area-content p-8 md:p-10 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default async function ServiceAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const areaService = getLegacyAreaServiceBySlug(slug);

  if (!areaService) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((post) =>
    areaService.relatedPostSlugs.includes(post.slug),
  );

  const heroImage = areaService.bannerImage || getAreaImage(areaService.slug);

  return (
    <>
      <div className="pb-4 pt-28">
        <div className="container mx-auto px-6">
          <Link
            href="/areas-we-serve"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All Areas
          </Link>
        </div>
      </div>

      <section className="relative mb-12 min-h-[360px] overflow-hidden">
        <ManagedImage
          slotKey={getAreaSlotKey(areaService.slug)}
          fallbackSrc={heroImage}
          fallbackAlt={areaService.areaName}
          fill
          priority
          quality={95}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 pb-12">
          <div className="container mx-auto px-6">
            <p className="pink-label mb-3">Luxury Transportation in {areaService.areaName}</p>
            <h1 className="max-w-4xl font-serif text-4xl leading-tight text-foreground md:text-6xl">
              {areaService.pageTitle}
            </h1>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <SectionCard html={areaService.introHtml} />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass-card p-8">
                  <p className="pink-label mb-3">Explore The Fleet</p>
                  <h2 className="mb-3 font-serif text-3xl text-foreground">
                    Party Buses for Big Nights
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    Explore our party bus lineup for birthdays, weddings, proms,
                    concerts, and every group celebration in {areaService.areaName}.
                  </p>
                  <Link href="/chicago-party-bus-rental" className="btn-primary">
                    View Party Buses <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="glass-card p-8">
                  <p className="pink-label mb-3">Refined Travel</p>
                  <h2 className="mb-3 font-serif text-3xl text-foreground">
                    Limousines for Elegant Arrivals
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    Browse stretch limos and executive rides for weddings,
                    corporate events, and upscale nights out across {areaService.areaName}.
                  </p>
                  <Link href="/chicago-limo-rental" className="btn-outline">
                    View Limos <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <SectionCard html={areaService.servicesHtml} />
              <SectionCard html={areaService.fleetHtml} />
              <SectionCard html={areaService.whyChooseHtml} />
              <SectionCard html={areaService.attractionsHtml} />

              {areaService.mapEmbedUrl ? (
                <div className="glass-card overflow-hidden">
                  <div className="p-8 pb-0">
                    <p className="pink-label mb-3">Plan The Route</p>
                    <h2 className="font-serif text-3xl text-foreground">
                      Explore {areaService.areaName}
                    </h2>
                  </div>
                  <div className="p-4 pt-6">
                    <iframe
                      src={areaService.mapEmbedUrl}
                      title={`Map of ${areaService.areaName}, IL`}
                      className="h-[420px] w-full rounded-2xl border border-border"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              ) : null}

              {relatedPosts.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <p className="pink-label mb-3">From The Blog</p>
                    <h2 className="font-serif text-3xl text-foreground">
                      Planning Tips For Your Event
                    </h2>
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
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
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
              ) : null}
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-28">
                <QuoteForm compact />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
