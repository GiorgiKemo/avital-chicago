import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import PageHeader from '@/components/PageHeader';
import heroPartyBus from '@/assets/hero-partybus.jpg';

const Blog = () => (
  <>
    <PageHeader
      label="Our Blog"
      title={<>Latest <span className="gradient-text font-semibold">Insights</span></>}
      subtitle="Tips, guides, and inspiration for your luxury transportation experience."
    />

    <section className="pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group glass-card overflow-hidden">
              <div className="image-hover-zoom aspect-video">
                <img src={heroPartyBus} alt={post.title} className="w-full h-full object-cover" loading="lazy" width={800} height={450} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-primary font-semibold group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Blog;
