import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { notFound } from "next/navigation";
import QuoteForm from "@/components/QuoteForm";
import { getPartyBusBySlug, partyBuses } from "@/lib/site-data";

export function generateStaticParams() {
  return partyBuses.map((vehicle) => ({ slug: vehicle.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const vehicle = getPartyBusBySlug(slug);

    if (!vehicle) {
      return { title: "Party Bus Not Found" };
    }

    return {
      title: `${vehicle.name} Party Bus`,
      description: vehicle.description,
    };
  });
}

export default async function PartyBusDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getPartyBusBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const heroImage = vehicle.images[0] || "/images/hero/hero-partybus.jpg";
  const gallery = vehicle.images.slice(1, 9);

  return (
    <>
      <div className="pb-4 pt-28">
        <div className="container mx-auto px-6">
          <Link
            href="/chicago-party-bus-rental"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Party Bus Fleet
          </Link>
        </div>
      </div>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <h1 className="mb-2 font-serif text-4xl text-foreground md:text-5xl">
                {vehicle.name}
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">{vehicle.tagline}</p>

              <div className="mb-12 grid grid-cols-1 gap-4">
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <Image
                    src={heroImage}
                    alt={vehicle.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 900px"
                  />
                </div>
                {gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {gallery.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg"
                      >
                        <Image
                          src={image}
                          alt={`${vehicle.name} gallery ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="mb-12 leading-relaxed text-muted-foreground">
                {vehicle.description}
              </p>

              <div className="glass-card mb-8 p-8">
                <h2 className="mb-6 font-serif text-xl text-foreground">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card-glow flex items-center gap-6 p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-3xl font-semibold text-foreground">
                    {vehicle.passengers}
                  </p>
                  <p className="text-sm text-muted-foreground">Maximum passengers</p>
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
