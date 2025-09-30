import { Calendar, User, Eye, MessageCircle, Bookmark } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string | null;
    image_url: string | null;
    category: string;
    created_at: string;
    tags?: string[] | null;
  };
}

const NewsCard = ({ article }: NewsCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <Card className="group gaming-border hover-glow cursor-pointer bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      <div className="relative">
        <img
          src={article.image_url || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary text-primary-foreground shadow-glow">
            {article.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button size="icon" variant="ghost" className="bg-black/50 hover:bg-black/70 hover-glow">
            <Bookmark className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 
          className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
          onClick={handleClick}
        >
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {article.excerpt || "No excerpt available"}
        </p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Admin</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>0</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span>0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;