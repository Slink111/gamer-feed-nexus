import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Navigate } from "react-router-dom";

const articleSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().trim().min(1, "Content is required"),
  excerpt: z.string().trim().max(300, "Excerpt too long").optional(),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  category: z.string().trim().min(1, "Category is required"),
  tags: z.string().optional(),
});

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

const AdminPanel = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: "",
    category: "gaming",
    tags: "",
    featured: false,
    published: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkAdminAccess = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setUserProfile(profile);
        
        if (profile?.role === "admin") {
          fetchArticles();
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const validation = articleSchema.safeParse(formData);
      if (!validation.success) {
        setError(validation.error.issues[0].message);
        setSaving(false);
        return;
      }

      const articleData = {
        ...validation.data,
        excerpt: validation.data.excerpt || null,
        image_url: validation.data.image_url || null,
        tags: validation.data.tags ? validation.data.tags.split(",").map(t => t.trim()) : [],
        featured: formData.featured,
        published: formData.published,
        author_id: user?.id,
      };

      if (selectedArticle) {
        // Update existing article
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", selectedArticle.id);

        if (error) throw error;
        toast.success("Article updated successfully");
      } else {
        // Create new article
        const { error } = await supabase
          .from("articles")
          .insert([articleData]);

        if (error) throw error;
        toast.success("Article created successfully");
      }

      // Reset form
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        image_url: "",
        category: "gaming",
        tags: "",
        featured: false,
        published: false,
      });
      setSelectedArticle(null);
      fetchArticles();
    } catch (error: any) {
      setError(error.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      image_url: article.image_url || "",
      category: article.category,
      tags: article.tags?.join(", ") || "",
      featured: article.featured,
      published: article.published,
    });
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);

      if (error) throw error;
      toast.success("Article deleted successfully");
      fetchArticles();
    } catch (error: any) {
      toast.error("Failed to delete article");
    }
  };

  const handleCancel = () => {
    setSelectedArticle(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      image_url: "",
      category: "gaming",
      tags: "",
      featured: false,
      published: false,
    });
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (userProfile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You don't have admin privileges to access this panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage your gaming news articles</p>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="articles">All Articles</TabsTrigger>
            <TabsTrigger value="create">
              {selectedArticle ? "Edit Article" : "Create Article"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Articles ({articles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No articles found. Create your first article!
                    </p>
                  ) : (
                    articles.map((article) => (
                      <div
                        key={article.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{article.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{article.category}</Badge>
                              {article.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                              <Badge variant={article.published ? "default" : "destructive"}>
                                {article.published ? "Published" : "Draft"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(article)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedArticle ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {selectedArticle ? "Edit Article" : "Create New Article"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter article title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Gaming, Reviews, Esports"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the article"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="gaming, review, pc, console"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article content here..."
                      rows={10}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                      />
                      <Label htmlFor="featured">Featured Article</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                      />
                      <Label htmlFor="published">Publish Article</Label>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button type="submit" disabled={saving}>
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {selectedArticle ? "Update Article" : "Create Article"}
                    </Button>
                    {selectedArticle && (
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;