import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from "@/components/seo/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Share2, 
  BarChart3,
  Activity,
  Target,
  Award,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  trend = "up" 
}: { 
  icon: any; 
  title: string; 
  value: string; 
  change: string; 
  trend?: "up" | "down" | "neutral";
}) => {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";
  
  return (
    <Card className="bg-white border-zinc-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendColor} flex items-center gap-1 mt-1`}>
          {trend === "up" && <TrendingUp className="h-3 w-3" />}
          {change}
        </p>
      </CardContent>
    </Card>
  );
};

const UserAnalytics = () => {
  const navigate = useNavigate();
  
  // No authentication check needed

  // Mock data for demonstration
  const weeklyPosts = [
    { day: "Mon", posts: 2, engagement: 145 },
    { day: "Tue", posts: 1, engagement: 89 },
    { day: "Wed", posts: 3, engagement: 312 },
    { day: "Thu", posts: 2, engagement: 198 },
    { day: "Fri", posts: 1, engagement: 167 },
    { day: "Sat", posts: 0, engagement: 0 },
    { day: "Sun", posts: 1, engagement: 78 },
  ];

  const topPosts = [
    { 
      title: "Why simple beats complex in product design", 
      impressions: 15420, 
      engagement: 8.2,
      date: "2 days ago"
    },
    { 
      title: "Lessons from my $10M mistake at Microsoft", 
      impressions: 12890, 
      engagement: 7.5,
      date: "5 days ago"
    },
    { 
      title: "Ship in 2 weeks or kill it - our product philosophy", 
      impressions: 9870, 
      engagement: 6.9,
      date: "1 week ago"
    },
  ];

  const engagementMetrics = {
    likes: 3542,
    comments: 892,
    shares: 456,
    profileViews: 1823
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`Analytics – ${user?.profile?.fullName || 'Your'} Content Performance`}
        description="Track your LinkedIn content performance and engagement metrics"
        canonicalPath="/analytics"
      />

      <main className="mx-auto max-w-7xl px-4 pt-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Analytics Dashboard</h1>
            <p className="mt-2 text-base md:text-lg text-muted-foreground">
              Track your content performance and optimize your LinkedIn strategy
            </p>
          </header>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Eye}
              title="Total Impressions"
              value="38.2K"
              change="+12.5% from last week"
              trend="up"
            />
            <StatCard
              icon={Users}
              title="Profile Views"
              value="1,823"
              change="+8.3% from last week"
              trend="up"
            />
            <StatCard
              icon={MessageSquare}
              title="Engagement Rate"
              value="7.4%"
              change="+2.1% from last week"
              trend="up"
            />
            <StatCard
              icon={Share2}
              title="Shares"
              value="456"
              change="+18% from last week"
              trend="up"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Activity */}
            <Card className="lg:col-span-2 border-gradient-brand">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your posting frequency and engagement trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyPosts.map((day) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Progress 
                            value={(day.engagement / 350) * 100} 
                            className="flex-1 h-2"
                          />
                          <span className="text-xs text-muted-foreground w-10">{day.engagement}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {day.posts} {day.posts === 1 ? 'post' : 'posts'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Performance Score */}
            <Card className="bg-white border-zinc-200">
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
                <CardDescription>Overall content effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.82)}`}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#EC4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold">82</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Consistency
                      </span>
                      <Badge variant="secondary">Excellent</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Reach
                      </span>
                      <Badge variant="secondary">Good</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Engagement
                      </span>
                      <Badge variant="secondary">Great</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Posts */}
          <Card className="mt-6 border-gradient-brand">
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Your best content from the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={index} className="flex items-start justify-between p-4 rounded-lg bg-secondary/40">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <h3 className="font-medium text-sm">{post.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.impressions.toLocaleString()} impressions
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {post.engagement}% engagement
                        </span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white border-zinc-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{engagementMetrics.likes.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-zinc-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{engagementMetrics.comments.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-zinc-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Shares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{engagementMetrics.shares.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-zinc-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{engagementMetrics.profileViews.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserAnalytics;