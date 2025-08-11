import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Link2,
  FileText,
  Upload,
  StickyNote,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit2,
  ArrowUpDown,
  Sparkles,
  Youtube,
  Newspaper,
  MessageSquare,
  Globe,
  File,
  Linkedin,
  Twitter,
  ExternalLink,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface ContentIdea {
  id: string;
  type: 'link' | 'note' | 'file' | 'video';
  content: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  platform?: 'linkedin' | 'twitter' | 'youtube' | 'reddit' | 'article' | 'other';
  url?: string;
  fileName?: string;
  isStarred: boolean;
  createdAt: Date;
  tags?: string[];
}

const ContentIdeas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<'all' | 'starred' | 'links' | 'notes' | 'files'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'priority'>('recent');
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isStarredInput, setIsStarredInput] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }
  }, [user, navigate]);

  // Load ideas from localStorage
  useEffect(() => {
    const savedIdeas = localStorage.getItem('contentIdeas');
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      }));
    }
  }, []);

  // Save ideas to localStorage
  useEffect(() => {
    localStorage.setItem('contentIdeas', JSON.stringify(ideas));
  }, [ideas]);

  // Detect platform from URL
  const detectPlatform = (url: string): ContentIdea['platform'] => {
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('reddit.com')) return 'reddit';
    if (url.includes('medium.com') || url.includes('substack.com')) return 'article';
    return 'other';
  };

  // Detect input type
  const detectInputType = (text: string): ContentIdea['type'] => {
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
    if (urlPattern.test(text)) {
      if (text.includes('youtube.com') || text.includes('youtu.be')) return 'video';
      return 'link';
    }
    return 'note';
  };

  // Mock metadata fetching
  const fetchMetadata = (url: string) => {
    const platform = detectPlatform(url);
    const mockData: Record<string, Partial<ContentIdea>> = {
      linkedin: {
        title: "5 lessons from building a product users love",
        description: "After 3 years and countless iterations, here's what actually worked...",
        thumbnail: "https://via.placeholder.com/200x100/0077B5/ffffff?text=LinkedIn"
      },
      twitter: {
        title: "Thread: How we grew from 0 to 10k users",
        description: "A detailed breakdown of our growth strategy and what we learned along the way",
        thumbnail: "https://via.placeholder.com/200x100/1DA1F2/ffffff?text=X"
      },
      youtube: {
        title: "The Future of Product Management",
        description: "Deep dive into emerging trends and tools shaping the PM landscape",
        thumbnail: "https://via.placeholder.com/200x100/FF0000/ffffff?text=YouTube"
      },
      default: {
        title: "Saved content from " + new URL(url).hostname,
        description: "Click to view the original content",
      }
    };
    
    return mockData[platform] || mockData.default;
  };

  // Add new idea
  const handleAddIdea = () => {
    if (!input.trim()) {
      toast.error("Please enter a URL, idea, or upload a file");
      return;
    }

    const type = detectInputType(input);
    const isUrl = type === 'link' || type === 'video';
    
    const newIdea: ContentIdea = {
      id: Date.now().toString(),
      type,
      content: input,
      isStarred: isStarredInput,
      createdAt: new Date(),
      ...(isUrl && {
        url: input,
        platform: detectPlatform(input),
        ...fetchMetadata(input)
      })
    };

    setIdeas(prev => [newIdea, ...prev]);
    setInput("");
    setIsStarredInput(false);
    toast.success("Idea added successfully!");
  };

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const newIdea: ContentIdea = {
        id: Date.now().toString() + file.name,
        type: 'file',
        content: file.name,
        fileName: file.name,
        title: file.name,
        description: `${(file.size / 1024).toFixed(1)} KB`,
        isStarred: false,
        createdAt: new Date()
      };
      setIdeas(prev => [newIdea, ...prev]);
    });
    
    toast.success(`${files.length} file(s) uploaded successfully!`);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Toggle star
  const toggleStar = (id: string) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === id ? { ...idea, isStarred: !idea.isStarred } : idea
    ));
  };

  // Delete idea
  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
    toast.success("Idea removed");
  };

  // Filter ideas
  const filteredIdeas = ideas
    .filter(idea => {
      if (filter === 'starred') return idea.isStarred;
      if (filter === 'links') return idea.type === 'link' || idea.type === 'video';
      if (filter === 'notes') return idea.type === 'note';
      if (filter === 'files') return idea.type === 'file';
      return true;
    })
    .filter(idea => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        idea.content.toLowerCase().includes(query) ||
        idea.title?.toLowerCase().includes(query) ||
        idea.description?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  // Get platform icon
  const getPlatformIcon = (platform?: ContentIdea['platform']) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'reddit': return <MessageSquare className="w-4 h-4" />;
      case 'article': return <Newspaper className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  // Get type icon
  const getTypeIcon = (type: ContentIdea['type']) => {
    switch (type) {
      case 'link': return <Link2 className="w-4 h-4" />;
      case 'note': return <StickyNote className="w-4 h-4" />;
      case 'file': return <File className="w-4 h-4" />;
      case 'video': return <Youtube className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Content Ideas – LinkedIn Content Engine"
        description="Collect and organize your content inspiration"
        canonicalPath="/ideas"
      />

      <main className="mx-auto max-w-6xl px-6 pt-12 pb-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Content Ideas
          </h1>
          <p className="text-muted-foreground">
            Collect inspiration from anywhere
          </p>
        </div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div 
            className={`relative rounded-xl border ${isDragging ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-gray-200 dark:border-zinc-800'} transition-all`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-amber-500 to-green-500 rounded-t-xl" />
            
            <div className="p-6">
              {isDragging ? (
                <div className="py-12 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <p className="text-lg font-medium">Drop files here</p>
                  <p className="text-sm text-muted-foreground mt-1">PDFs, documents, and more</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddIdea()}
                      placeholder="Paste a URL, type an idea, or drag files here..."
                      className="flex-1 text-lg h-12 border-0 shadow-none focus-visible:ring-0 px-0"
                    />
                    <Button
                      onClick={() => setIsStarredInput(!isStarredInput)}
                      variant="ghost"
                      size="icon"
                      className={isStarredInput ? 'text-amber-500' : 'text-gray-400'}
                    >
                      <Star className={`w-5 h-5 ${isStarredInput ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      onClick={handleAddIdea}
                      className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {/* Quick actions */}
                  <div className="flex gap-2 mt-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload file
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput('https://')}
                    >
                      <Link2 className="w-4 h-4 mr-2" />
                      Add link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('input')?.focus()}
                    >
                      <StickyNote className="w-4 h-4 mr-2" />
                      Add note
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="flex-1">
            <TabsList className="grid grid-cols-5 w-full max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ideas..."
                className="pl-9 w-[200px]"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                  <Clock className="w-4 h-4 mr-2" />
                  Most Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('priority')}>
                  <Star className="w-4 h-4 mr-2" />
                  Priority First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Ideas Grid */}
        <AnimatePresence mode="popLayout">
          {filteredIdeas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No ideas yet</h3>
              <p className="text-muted-foreground mb-6">
                Start collecting inspiration from anywhere on the web
              </p>
              <Button
                onClick={() => document.querySelector('input')?.focus()}
                variant="outline"
              >
                Add your first idea
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIdeas.map((idea) => (
                <motion.div
                  key={idea.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -2 }}
                  className="group relative bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-5 hover:shadow-lg transition-all"
                >
                  {/* Star indicator */}
                  {idea.isStarred && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {idea.platform ? getPlatformIcon(idea.platform) : getTypeIcon(idea.type)}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(idea.createdAt)}
                      </span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleStar(idea.id)}>
                          <Star className={`w-4 h-4 mr-2 ${idea.isStarred ? 'fill-current text-amber-500' : ''}`} />
                          {idea.isStarred ? 'Unstar' : 'Star'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteIdea(idea.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Thumbnail for links */}
                  {idea.thumbnail && (
                    <div className="mb-3 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      <img 
                        src={idea.thumbnail} 
                        alt={idea.title}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="space-y-2">
                    {idea.title ? (
                      <>
                        <h3 className="font-medium line-clamp-2">{idea.title}</h3>
                        {idea.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {idea.description}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm line-clamp-3">{idea.content}</p>
                    )}
                  </div>
                  
                  {/* Link */}
                  {idea.url && (
                    <a
                      href={idea.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      View original
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ContentIdeas;