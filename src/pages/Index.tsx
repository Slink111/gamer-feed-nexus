import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import NewsCard from "../components/NewsCard";
import FeaturedPost from "../components/FeaturedPost";
import { mockArticles, categories, featuredArticle } from "../data/mockData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleArticleClick = (id: number) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Featured Article */}
        <section className="mb-12">
          <FeaturedPost article={featuredArticle} onClick={handleArticleClick} />
        </section>

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

          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4">No articles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search query or selecting a different category.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onClick={handleArticleClick}
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
