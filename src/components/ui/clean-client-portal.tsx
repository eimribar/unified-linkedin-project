import React, { useState } from 'react';
import { 
  LogOut,
  Filter,
  Search,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { CleanStats } from '@/components/ui/clean-stats';
import { CleanContentCard } from '@/components/ui/clean-content-card';
import { cn } from '@/lib/utils';

interface CleanClientPortalProps {
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

export const CleanClientPortal: React.FC<CleanClientPortalProps> = ({
  client,
  content,
  stats,
  loading,
  isAdminMode,
  allClients,
  selectedClientId,
  onClientChange,
  onApprove,
  onReject,
  onEdit,
  onSignOut
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter content based on search
  const filteredContent = content.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.content_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hook?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-regular">Content Dashboard</h1>
              
              {/* Admin Client Selector */}
              {isAdminMode && allClients && allClients.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedClientId || ''}
                    onChange={(e) => onClientChange?.(e.target.value)}
                    className="appearance-none border rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Select Client</option>
                    {allClients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.company || c.email}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="text-right">
                <p className="text-sm">{client?.name || client?.company || 'Client'}</p>
                <p className="text-xs text-muted-foreground">{client?.email}</p>
              </div>
              
              {/* Sign Out */}
              <button
                onClick={onSignOut}
                className="border rounded-md p-2 hover:bg-gray-50 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl tracking-tight">Content Overview</h2>
          <p className="text-muted-foreground mt-1">Review and manage your LinkedIn content</p>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <CleanStats stats={stats} loading={loading} />
        </div>

        {/* Content Section */}
        <div>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">
              Content for Review
              {content.length > 0 && (
                <span className="text-muted-foreground ml-2">
                  ({content.length})
                </span>
              )}
            </h3>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 w-64"
                />
              </div>

              {/* Filter */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="border rounded-md p-2 hover:bg-gray-50 transition-colors"
                aria-label="Filter"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading content...</p>
              </div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-20 border rounded-md">
              <p className="text-muted-foreground">No content for review</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? 'Try adjusting your search' : 'Check back later for new content'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item) => (
                <CleanContentCard
                  key={item.id}
                  item={item}
                  onApprove={onApprove}
                  onReject={onReject}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};