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
    <div className="border-2 rounded-lg p-6 hover:border-slate-300 transition-all duration-200 bg-white hover:shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-700">
            Variant #{item.variant_number}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(item.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
          Pending
        </span>
      </div>

      {/* Hook */}
      {item.hook && (
        <div className="mb-4">
          <p className="text-xs font-medium text-indigo-600 mb-1.5">Hook</p>
          <p className="text-base text-slate-800 font-medium">{item.hook}</p>
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        <p className="text-sm leading-relaxed text-slate-700">
          {isExpanded ? item.content_text : `${item.content_text.substring(0, 200)}...`}
        </p>
        {item.content_text.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-indigo-600 mt-2 flex items-center gap-1 hover:text-indigo-700 transition-colors"
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
            <span key={i} className="text-xs text-slate-500">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={() => onApprove(item)}
          className="flex-1 border-2 border-emerald-200 text-emerald-700 rounded-md py-2 px-4 text-sm hover:bg-emerald-50 transition-all duration-200 font-medium"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(item)}
          className="flex-1 border-2 border-rose-200 text-rose-700 rounded-md py-2 px-4 text-sm hover:bg-rose-50 transition-all duration-200 font-medium"
        >
          Reject
        </button>
        <button
          onClick={() => onEdit(item)}
          className="border-2 border-slate-200 rounded-md p-2 hover:bg-slate-50 transition-all duration-200 text-slate-600"
          aria-label="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export { CleanContentCard };