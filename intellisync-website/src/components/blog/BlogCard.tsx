import { motion } from 'framer-motion';
import { BlogPost } from '../../types/blog';
import { format } from 'date-fns';
import { ReactionButton, CommentSection, ShareButton } from '../social';

interface BlogCardProps {
  post: BlogPost;
  onView: (post: BlogPost) => void;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onView, index }) => {
  const delay = index * 0.1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
      onClick={() => onView(post)}
      aria-label={`Read more: ${post.title}`}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent1 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-6 text-base line-clamp-3 flex-grow">{post.excerpt}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1.5 text-sm font-medium text-accent1 bg-accent1/10 rounded-full hover:bg-accent1/20 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden mr-3 border-2 border-white shadow-sm">
                <img 
                  src={post.author.avatarUrl} 
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/placeholder-avatar.png'; // Fallback image
                  }}
                />
              </span>
              <div>
                <div className="font-medium text-gray-900">{post.author.name}</div>
                <div className="text-xs text-gray-500">{post.author.role}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-700">{format(new Date(post.publishedAt), 'MMM d, yyyy')}</div>
              <div className="text-xs text-gray-400">{post.readTime} min read</div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <ReactionButton postId={post.id} />
            <CommentSection postId={post.id} />
            <ShareButton postUrl={`${window.location.origin}/blog/${post.slug}`} />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
