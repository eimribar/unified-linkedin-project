// =====================================================
// CLIENT PORTAL REDESIGN
// High-quality UI matching sign-in page design language
// =====================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut,
  Building,
  User,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Eye,
  MessageSquare,
  Hash,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ClientPortalProps {
  client: any;
  content: any[];
  stats: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  loading: boolean;
  isAdminMode?: boolean;
  allClients?: any[];
  selectedClientId?: string | null;
  onClientChange?: (clientId: string) => void;
  onApprove: (item: any) => Promise<void>;
  onReject: (item: any) => Promise<void>;
  onEdit: (item: any) => void;
  onSignOut: () => void;
}

// Animated stat card component
const StatCard = ({ icon: Icon, value, label, color, delay = 0 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white rounded-2xl blur-xl opacity-60" />
      <Card className="relative bg-white/80 backdrop-blur-sm border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              color
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Content approval card with high-quality design
const ContentCard = ({ item, onApprove, onReject, onEdit, index }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card className="bg-white border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Post Variant #{item.variant_number}</p>
                <p className="text-xs text-gray-500">Created {new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
              Pending Review
            </Badge>
          </div>

          {/* Hook */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Hook
            </p>
            <p className="font-medium text-gray-900">{item.hook}</p>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              {isExpanded ? item.content_text : `${item.content_text.substring(0, 150)}...`}
            </p>
            {item.content_text.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-blue-600 hover:text-blue-700 mt-2 flex items-center gap-1"
              >
                {isExpanded ? 'Show less' : 'Read more'}
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </button>
            )}
          </div>

          {/* Hashtags */}
          {item.hashtags && item.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.hashtags.map((tag: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  <Hash className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onApprove(item)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              Approve
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReject(item)}
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              Reject
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(item)}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Modern header with glass morphism
const ModernHeader = ({ client, isAdminMode, allClients, selectedClientId, onClientChange, onSignOut }: any) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : "bg-white/60 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Building className="w-6 h-6 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {client?.company || 'Content Portal'}
              </h1>
              <p className="text-sm text-gray-500">
                {isAdminMode ? `Admin: ${client?.name}` : `Welcome back, ${client?.name}`}
              </p>
            </div>

            {/* Admin selector */}
            {isAdminMode && allClients?.length > 0 && (
              <select
                className="ml-4 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedClientId || ''}
                onChange={(e) => onClientChange?.(e.target.value)}
              >
                <option value="">Select Client</option>
                {allClients.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAdminMode && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => window.location.href = 'https://ghostwriter-portal.vercel.app'}
              >
                Back to Admin
              </Button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            <Button
              onClick={onSignOut}
              className="bg-gray-900 text-white hover:bg-black rounded-xl px-4 py-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Main component
export const ClientPortalRedesign: React.FC<ClientPortalProps> = ({
  client,
  content,
  stats,
  loading,
  isAdminMode = false,
  allClients = [],
  selectedClientId,
  onClientChange,
  onApprove,
  onReject,
  onEdit,
  onSignOut
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <ModernHeader
        client={client}
        isAdminMode={isAdminMode}
        allClients={allClients}
        selectedClientId={selectedClientId}
        onClientChange={onClientChange}
        onSignOut={onSignOut}
      />

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Content Dashboard
            </h2>
            <p className="text-gray-500 mt-2">Review and manage your LinkedIn content</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Clock}
              value={stats.pending}
              label="Pending Review"
              color="bg-gradient-to-br from-amber-500 to-orange-600"
              delay={0}
            />
            <StatCard
              icon={CheckCircle2}
              value={stats.approved}
              label="Approved"
              color="bg-gradient-to-br from-green-500 to-emerald-600"
              delay={0.1}
            />
            <StatCard
              icon={XCircle}
              value={stats.rejected}
              label="Rejected"
              color="bg-gradient-to-br from-red-500 to-rose-600"
              delay={0.2}
            />
            <StatCard
              icon={BarChart3}
              value={stats.total}
              label="Total Content"
              color="bg-gradient-to-br from-blue-500 to-purple-600"
              delay={0.3}
            />
          </div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                <h3 className="text-xl font-bold text-gray-900">Content for Review</h3>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                  {content.length} items
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Content Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                  <p className="text-gray-500">Loading your content...</p>
                </div>
              </div>
            ) : content.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Content for Review</h3>
                <p className="text-gray-500">Your content queue is empty. Check back later!</p>
              </motion.div>
            ) : (
              <div className="grid gap-6">
                {content.map((item, index) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    index={index}
                    onApprove={onApprove}
                    onReject={onReject}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};