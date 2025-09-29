import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Eye, MessageCircle, Share2, Bookmark, ThumbsUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { mockArticles, featuredArticle } from "../data/mockData";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find article by ID (including featured article)
  const allArticles = [...mockArticles, featuredArticle];
  const article = allArticles.find((a) => a.id === Number(id));

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

  const relatedArticles = mockArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

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
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{article.publishDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{article.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>{article.comments} comments</span>
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
        <div className="mb-8 rounded-xl overflow-hidden gaming-border">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <Card className="gaming-border bg-card/80 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                {article.excerpt}
              </p>
              
              <div className="space-y-6 text-foreground">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                
                <p>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                
                <h3 className="text-2xl font-bold text-primary mt-8 mb-4">Key Highlights</h3>
                
                <ul className="space-y-2 ml-6">
                  <li>Revolutionary gameplay mechanics that redefine the genre</li>
                  <li>Stunning visual improvements with next-gen graphics</li>
                  <li>Enhanced performance across all gaming platforms</li>
                  <li>Innovative features that push gaming boundaries</li>
                </ul>
                
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
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
                      src={relatedArticle.featuredImage}
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
                      <span>{relatedArticle.author}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedArticle.publishDate}</span>
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