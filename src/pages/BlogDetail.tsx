import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { blogPosts } from '@/data/blog';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="section-heading">Post not found</h1>
        <Link to="/blog" className="btn-primary mt-8 inline-flex">All Posts</Link>
      </div>
    );
  }

  return (
    <article className="pt-28 pb-24">
      <div className="container mx-auto px-6 max-w-[800px]">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-8">{post.title}</h1>

        <div className="text-muted-foreground leading-relaxed text-lg space-y-6">
          {post.content.split('. ').reduce((acc: string[][], sentence, i) => {
            const groupIdx = Math.floor(i / 3);
            if (!acc[groupIdx]) acc[groupIdx] = [];
            acc[groupIdx].push(sentence);
            return acc;
          }, []).map((group, i) => (
            <p key={i}>{group.join('. ')}.</p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;
