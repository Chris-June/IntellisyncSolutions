import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../../types/blog';
import { useAIContext } from '../../context/AIContext';
import { Search, X, Filter } from 'lucide-react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from '../../components/SEO';
import { getBreadcrumbSchema } from '../../utils/structuredData';
import { getPosts } from '../../utils/blogUtils';
import BlogCard from '../../components/blog/BlogCard';
import BlogModal from '../../components/blog/BlogModal';

const Blog: React.FC = () => {
  const { setEventContext } = useAIContext();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (selectedPost) {
      console.log('Selected post for modal:', selectedPost);
      console.log('Post content:', selectedPost.content);
    }
  }, [selectedPost]);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      setAllPosts(posts);
    };
    fetchPosts();
  }, []);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ]);

  const allUniqueTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach((post: BlogPost) => {
      post.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post: BlogPost) => {
      if (!post) return false;
      
      const searchLower = searchQuery.toLowerCase();
      const postTitle = post.title || '';
      const postExcerpt = post.excerpt || '';
      const postContent = typeof post.content === 'string' ? post.content : '';
      const matchesSearch = postTitle.toLowerCase().includes(searchLower) ||
                          postExcerpt.toLowerCase().includes(searchLower) ||
                          postContent.toLowerCase().includes(searchLower);
      
      const matchesTags = selectedTags.length === 0 || 
                         (post.tags && post.tags.some((tag: string) => selectedTags.includes(tag)));
      
      return matchesSearch && matchesTags;
    });
  }, [allPosts, searchQuery, selectedTags]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * postsPerPage;
    const lastPageIndex = firstPageIndex + postsPerPage;
    return filteredPosts.slice(firstPageIndex, lastPageIndex);
  }, [filteredPosts, currentPage, postsPerPage]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setEventContext(`The user is currently viewing the blog post titled "${post.title}". Here is the full content of the post:\n\n${post.content}`);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setEventContext('Blog Page'); // Reset context when modal is closed
  };

  const currentPostIndex = selectedPost 
    ? allPosts.findIndex(p => p.id === selectedPost.id) 
    : -1;
  const hasNextPost = currentPostIndex !== -1 && currentPostIndex < allPosts.length - 1;
  const hasPreviousPost = currentPostIndex > 0;

  const goToNextPost = () => {
    if (hasNextPost) {
      setSelectedPost(allPosts[currentPostIndex + 1]);
    }
  };

  const goToPreviousPost = () => {
    if (hasPreviousPost) {
      setSelectedPost(allPosts[currentPostIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] text-white">
      <SEO
        title="Blog | Intellisync Solutions"
        description="Explore our latest articles and insights on AI, technology, and business innovation."
        canonicalUrl="/blog"
        keywords="AI blog, technology articles, business innovation, artificial intelligence, tech insights"
        structuredData={[breadcrumbSchema]}
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-tr from-cta via-accent1 to-white bg-clip-text text-transparent mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            A.I. Engage
          </motion.h1>
          <motion.p 
            className="text-xl text-accent1 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          >
            Insights, stories, and updates on AI, technology, and business innovation.
          </motion.p>
        </section>
        
        <section className="max-w-4xl mx-auto mb-12">
          {/* Search and Filter */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-transparent"
              placeholder="Search articles..."
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-300">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allUniqueTags.map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-accent1 text-white'
                      : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-accent1 hover:text-accent2 hover:underline ml-2 flex items-center"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-400">
              Showing <span className="font-medium text-white">{filteredPosts.length}</span> 
              {filteredPosts.length === 1 ? ' article' : ' articles'}
              {selectedTags.length > 0 && (
                <span> in <span className="font-medium text-white">{selectedTags.join(', ')}</span></span>
              )}
            </p>
          </div>

          {/* Blog Grid */}
          {filteredPosts.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {paginatedPosts.map((post: BlogPost, index: number) => (
                  <BlogCard 
                    key={post.id} 
                    post={post} 
                    onView={handlePostClick}
                    index={index % 6}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white transition-colors"
                      aria-label="Previous page"
                    >
                      <span>Previous</span>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          currentPage === page
                            ? 'bg-accent1 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white transition-colors"
                      aria-label="Next page"
                    >
                      <span>Next</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white">No articles found</h3>
                <p className="mt-1">Try adjusting your search or filter criteria</p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
                className="mt-4 text-accent1 hover:text-accent2 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>

      <BlogModal
        post={selectedPost}
        onClose={closeModal}
        onNext={goToNextPost}
        onPrevious={goToPreviousPost}
        hasNext={hasNextPost}
        hasPrevious={hasPreviousPost}
      />
      
      <Footer />
    </div>
  );
};

export default Blog;