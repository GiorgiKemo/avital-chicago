import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import QuoteForm from "@/components/QuoteForm";
import { areas, getAreaImage, services } from "@/lib/site-data";

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const area = areas.find((item) => item.slug === slug);

    if (!area) {
      return { title: "Area Not Found" };
    }

    return {
      title: `Party Bus & Limo Rental in ${area.name}`,
      description: area.description,
    };
  });
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = areas.find((item) => item.slug === slug);

  if (!area) {
    notFound();
  }

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

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="relative mb-8 aspect-[16/7] overflow-hidden rounded-2xl">
                <Image
                  src={getAreaImage(area.slug)}
                  alt={area.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="pink-label mb-3">Serving {area.name}</p>
                  <h1 className="font-serif text-4xl text-foreground md:text-5xl">
                    Party Bus & Limo Rental in{" "}
                    <span className="gradient-text font-semibold">{area.name}</span>
                  </h1>
                </div>
              </div>

              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {area.description}
              </p>
              <p className="mb-12 leading-relaxed text-muted-foreground">
                Whether you&apos;re planning a wedding, quinceanera, prom, or
                night out in {area.name}, Avital Chicago Limousine provides
                luxury transportation options built around the size and pace of
                your event.
              </p>

              <div className="glass-card mb-8 p-8">
                <h2 className="mb-6 font-serif text-xl text-foreground">
                  Services Available in {area.name}
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="glass-card-glow p-10 text-center">
                <h2 className="mb-4 font-serif text-2xl text-foreground">
                  Book Your Ride in {area.name}
                </h2>
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
