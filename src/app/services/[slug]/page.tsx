import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import ManagedImage from "@/components/ManagedImage";
import QuoteForm from "@/components/QuoteForm";
import { getServiceImage, getServiceSlotKey, services } from "@/lib/site-data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const service = services.find((item) => item.slug === slug);

    if (!service) {
      return { title: "Service Not Found" };
    }

    return {
      title: service.pageTitle || service.name,
      description: service.metaDescription || service.description,
    };
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <div className="pb-4 pt-28">
        <div className="container mx-auto px-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All Services
          </Link>
        </div>
      </div>

      <section className="relative mb-12 min-h-[320px] overflow-hidden">
        <ManagedImage
          slotKey={getServiceSlotKey(service.slug)}
          fallbackSrc={getServiceImage(service.slug)}
          fallbackAlt={service.name}
          fill
          priority
          quality={95}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 pb-12">
          <div className="container mx-auto px-6">
            <p className="pink-label mb-3">{service.name}</p>
            <h1 className="font-serif text-5xl text-foreground md:text-6xl">
              {service.pageTitle || service.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              {service.contentHtml ? (
                <div
                  className="legacy-blog-content mb-12 text-lg leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: service.contentHtml }}
                />
              ) : (
                <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              )}

              <div className="glass-card-glow p-10 text-center">
                <h2 className="mb-4 font-serif text-2xl text-foreground">
                  Ready to Book?
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Get a free quote for your {service.name.toLowerCase()} transportation.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact-us" className="btn-primary">
                    Get a Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="tel:6305506753" className="btn-outline">
                    Call Us <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
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
