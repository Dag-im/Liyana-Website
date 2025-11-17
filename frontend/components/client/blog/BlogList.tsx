import { BlogPost } from '@/data/blogs';
import BlogCard from './BlockCard';

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
