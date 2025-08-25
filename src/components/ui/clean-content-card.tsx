import { useState } from 'react';
import { ChevronDown, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CleanContentCardProps {
  item: any;
  onApprove: (item: any) => void;
  onReject: (item: any) => void;
  onEdit: (item: any) => void;
}

function CleanContentCard({ item, onApprove, onReject, onEdit }: CleanContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border rounded-md p-6 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Variant #{item.variant_number}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(item.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <span className="text-xs text-muted-foreground border rounded-md px-2 py-1">
          Pending
        </span>
      </div>

      {/* Hook */}
      {item.hook && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Hook</p>
          <p className="text-base">{item.hook}</p>
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        <p className="text-sm leading-relaxed">
          {isExpanded ? item.content_text : `${item.content_text.substring(0, 200)}...`}
        </p>
        {item.content_text.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary mt-2 flex items-center gap-1 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Read more'}
            <ChevronDown className={cn(
              "w-3 h-3 transition-transform",
              isExpanded && "rotate-180"
            )} />
          </button>
        )}
      </div>

      {/* Hashtags */}
      {item.hashtags && item.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {item.hashtags.map((tag: string, i: number) => (
            <span key={i} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t">
        <button
          onClick={() => onApprove(item)}
          className="flex-1 border rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(item)}
          className="flex-1 border rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={() => onEdit(item)}
          className="border rounded-md p-2 hover:bg-gray-50 transition-colors"
          aria-label="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export { CleanContentCard };