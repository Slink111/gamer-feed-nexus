import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, User, Eye, MessageCircle, Share2, Bookmark, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  tags: string[] | null;
  created_at: string;
}

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .eq("published", true)
          .maybeSingle();

        if (error) {
          console.error("Error fetching article:", error);
        } else {
          setArticle(data);
          
          // Fetch related articles if we have a category
          if (data?.category) {
            const { data: related } = await supabase
              .from("articles")
              .select("*")
              .eq("published", true)
              .eq("category", data.category)
              .neq("id", id)
              .limit(3);
            
            setRelatedArticles(related || []);
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Button onClick={() => navigate("/")} variant="outline" className="hover-glow">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gaming-border border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button 
            onClick={() => navigate("/")} 
            variant="ghost" 
            className="hover-glow"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8">
          <Badge className="bg-primary text-primary-foreground shadow-glow mb-4">
            {article.category}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gradient">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>0 views</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>0 comments</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Button variant="outline" size="sm" className="hover-glow">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Like
            </Button>
            <Button variant="outline" size="sm" className="hover-glow">
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="hover-glow">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="mb-8 rounded-xl overflow-hidden gaming-border">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <Card className="gaming-border bg-card/80 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none">
              {article.excerpt && (
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  {article.excerpt}
                </p>
              )}
              
              <div className="space-y-6 text-foreground whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="hover-glow cursor-pointer">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gradient">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card 
                  key={relatedArticle.id}
                  className="gaming-border hover-glow cursor-pointer bg-card/80 backdrop-blur-sm transition-all hover:scale-[1.02]"
                  onClick={() => navigate(`/article/${relatedArticle.id}`)}
                >
                  <div className="relative">
                    <img
                      src={relatedArticle.image_url || "/placeholder.svg"}
                      alt={relatedArticle.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <Badge className="bg-primary text-primary-foreground shadow-glow w-fit">
                      {relatedArticle.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h4 className="font-semibold line-clamp-2 mb-2 hover:text-primary transition-colors">
                      {relatedArticle.title}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Admin</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(relatedArticle.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArticleDetail;