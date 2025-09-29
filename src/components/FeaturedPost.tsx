import { Calendar, User, Eye, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FeaturedPostProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    featuredImage: string;
    category: string;
    author: string;
    publishDate: string;
    views: number;
    comments: number;
    tags: string[];
  };
  onClick: (id: number) => void;
}

const FeaturedPost = ({ article, onClick }: FeaturedPostProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl gaming-border bg-radial-glow">
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent z-10" />
      <img
        src={article.featuredImage}
        alt={article.title}
        className="w-full h-96 object-cover"
      />
      
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-primary text-primary-foreground shadow-glow text-sm px-4 py-2">
              {article.category}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gradient">
              {article.title}
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              {article.excerpt}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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
                <span>{article.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>{article.comments}</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="gaming-gradient text-white hover:scale-105 transition-transform shadow-glow group"
              onClick={() => onClick(article.id)}
            >
              Read Full Article
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;