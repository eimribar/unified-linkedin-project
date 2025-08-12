import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, Users, FileText, Hash, Star, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase, Creator, ContentPost } from "@/lib/supabase";
import { toast } from "sonner";

interface CreatorWithPosts extends Creator {
  posts?: ContentPost[];
}

const ContentLake = () => {
  const [creators, setCreators] = useState<CreatorWithPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [minReactions, setMinReactions] = useState(100);

  // Mock data for development (replace with real Supabase queries)
  const mockCreators: CreatorWithPosts[] = [
    {
      id: "1",
      name: "Justin Welsh",
      linkedin_url: "https://linkedin.com/in/justinwelsh",
      profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      follower_count: 475000,
      bio: "Building a portfolio of one-person businesses",
      average_reactions: 850,
      content_themes: ["solopreneurship", "content-creation", "productivity"],
      created_at: new Date(),
      updated_at: new Date(),
      posts: [
        {
          id: "p1",
          creator_id: "1",
          original_url: "https://linkedin.com/posts/1",
          content_text: "The biggest mistake creators make?\n\nThinking they need to be everywhere.\n\nPick one platform. Master it. Then expand.\n\nDepth beats width every time.",
          post_type: "text",
          reactions_count: 1243,
          comments_count: 89,
          shares_count: 45,
          hashtags: ["contentcreation", "focus"],
          posted_at: new Date("2024-03-15"),
          scraped_at: new Date(),
          quality_score: 0.92,
          is_promotional: false,
          content_themes: ["content-creation", "strategy"]
        }
      ]
    },
    {
      id: "2",
      name: "Sahil Bloom",
      linkedin_url: "https://linkedin.com/in/sahilbloom",
      profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      follower_count: 890000,
      bio: "Exploring curiosity and sharing ideas on growth",
      average_reactions: 1200,
      content_themes: ["personal-growth", "mental-models", "career"],
      created_at: new Date(),
      updated_at: new Date(),
      posts: [
        {
          id: "p2",
          creator_id: "2",
          original_url: "https://linkedin.com/posts/2",
          content_text: "5 mental models that changed my life:\n\n1. Inversion - Start with the end goal\n2. Circle of Competence - Know your strengths\n3. First Principles - Break down complex problems\n4. Second-Order Thinking - Consider consequences\n5. Margin of Safety - Build in buffers\n\nWhich one resonates most with you?",
          post_type: "text",
          reactions_count: 2156,
          comments_count: 234,
          shares_count: 112,
          hashtags: ["mentalmodels", "growth", "productivity"],
          posted_at: new Date("2024-03-14"),
          scraped_at: new Date(),
          quality_score: 0.95,
          is_promotional: false,
          content_themes: ["mental-models", "personal-growth"]
        }
      ]
    },
    {
      id: "3",
      name: "Jasmin Alić",
      linkedin_url: "https://linkedin.com/in/jasminalic",
      profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      follower_count: 125000,
      bio: "Helping brands tell better stories",
      average_reactions: 650,
      content_themes: ["storytelling", "branding", "marketing"],
      created_at: new Date(),
      updated_at: new Date(),
      posts: [
        {
          id: "p3",
          creator_id: "3",
          original_url: "https://linkedin.com/posts/3",
          content_text: "Your brand isn't what you say it is.\n\nIt's what your customers say when you're not in the room.\n\nFocus less on perfecting your message.\nFocus more on delivering experiences worth talking about.",
          post_type: "text",
          reactions_count: 876,
          comments_count: 67,
          shares_count: 34,
          hashtags: ["branding", "customerexperience"],
          posted_at: new Date("2024-03-13"),
          scraped_at: new Date(),
          quality_score: 0.88,
          is_promotional: false,
          content_themes: ["branding", "marketing"]
        }
      ]
    }
  ];

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is configured
      if (!supabase.auth) {
        // Use mock data if Supabase is not configured
        setCreators(mockCreators);
        setLoading(false);
        return;
      }

      // Real Supabase query
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('creators')
        .select('*')
        .eq('is_active', true)
        .order('average_reactions', { ascending: false });

      if (creatorsError) throw creatorsError;

      // Load top posts for each creator
      if (creatorsData) {
        const creatorsWithPosts = await Promise.all(
          creatorsData.map(async (creator) => {
            const { data: posts } = await supabase
              .from('content_posts')
              .select('*')
              .eq('creator_id', creator.id)
              .gte('reactions_count', 100)
              .order('reactions_count', { ascending: false })
              .limit(3);
            
            return { ...creator, posts: posts || [] };
          })
        );
        setCreators(creatorsWithPosts);
      }
    } catch (error) {
      console.error('Error loading creators:', error);
      // Fall back to mock data
      setCreators(mockCreators);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = !searchQuery || 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTheme = selectedTheme === "all" || 
      creator.content_themes?.includes(selectedTheme);
    
    return matchesSearch && matchesTheme;
  });

  const uniqueThemes = Array.from(new Set(creators.flatMap(c => c.content_themes || [])));

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Content Lake</h1>
          <p className="text-zinc-600">Curated high-performing content from top LinkedIn creators</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search creators, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Content Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {uniqueThemes.map(theme => (
                  <SelectItem key={theme} value={theme}>
                    {theme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Post Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="text">Text Only</SelectItem>
                <SelectItem value="image">With Images</SelectItem>
                <SelectItem value="carousel">Carousels</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-600">{creators.length} Creators</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-600">
                {creators.reduce((acc, c) => acc + (c.posts?.length || 0), 0)} Posts
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-600">Min {minReactions} reactions</span>
            </div>
          </div>
        </div>

        {/* Creator Cards */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-6 animate-pulse">
                <div className="h-40 bg-zinc-100 rounded-lg mb-4" />
                <div className="h-4 bg-zinc-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-zinc-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCreators.map(creator => (
              <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={creator.profile_image} />
                      <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-zinc-900">{creator.name}</h3>
                          <p className="text-sm text-zinc-600">
                            {creator.follower_count?.toLocaleString()} followers
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-zinc-600 mt-2 line-clamp-2">{creator.bio}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {creator.average_reactions} avg reactions
                        </Badge>
                        {creator.content_themes?.slice(0, 2).map(theme => (
                          <Badge key={theme} variant="outline" className="text-xs">
                            {theme.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {creator.posts && creator.posts.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Top Posts
                      </div>
                      {creator.posts.slice(0, 2).map(post => (
                        <div 
                          key={post.id} 
                          className="p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          <p className="text-sm text-zinc-700 line-clamp-3 mb-2">
                            {post.content_text}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {post.reactions_count}
                            </span>
                            <span>{post.comments_count} comments</span>
                            <span>{post.shares_count} shares</span>
                          </div>
                          {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {post.hashtags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs py-0">
                                  <Hash className="h-3 w-3" />{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredCreators.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No creators found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLake;