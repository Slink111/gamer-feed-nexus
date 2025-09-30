import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import NewsCard from "@/components/NewsCard";
import FeaturedPost from "@/components/FeaturedPost";
import { Loader2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  tags: string[] | null;
  featured: boolean;
  published: boolean;
  created_at: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter posts based on search and category
  const filteredPosts = articles.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = articles.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const categories = ["All", ...Array.from(new Set(articles.map(post => post.category)))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Featured Article */}
        {featuredPost && (
          <section className="mb-12">
            <FeaturedPost article={featuredPost} />
          </section>
        )}

        {/* Latest News Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gradient">Latest Gaming News</h2>
            <div className="h-1 flex-1 mx-8 gaming-gradient rounded-full opacity-30" />
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {regularPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4">No articles found</h3>
                <p className="text-muted-foreground">
                  {articles.length === 0 
                    ? "No articles have been published yet. Check back later!" 
                    : "Try adjusting your search query or selecting a different category."
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t gaming-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gradient">GameZone</h3>
            <p className="text-muted-foreground">Your ultimate gaming news destination</p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 GameZone</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;