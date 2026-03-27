import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { blogPosts } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read insights, planning tips, and transportation guides from Avital Chicago Limousine.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        label="Our Blog"
        title={
          <>
            Latest <span className="gradient-text font-semibold">Insights</span>
          </>
        }
        subtitle="Tips, guides, and inspiration for your luxury transportation experience."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group glass-card overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.featuredImage || "/images/hero/hero-partybus.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <h2 className="mb-2 font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary transition-all group-hover:gap-2">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
