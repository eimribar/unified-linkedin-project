import { useState } from 'react';
import { ChevronDown, Edit2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CleanContentCardProps {
  item: any;
  onApprove: (item: any) => Promise<void>;
  onReject: (item: any) => Promise<void>;
  onEdit: (item: any) => void;
}

function CleanContentCard({ item, onApprove, onReject, onEdit }: CleanContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  return (
    <div className="border rounded-lg p-6 hover:border-slate-300 transition-all duration-200 bg-white hover:shadow-sm">
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

      {/* Content */}
      <div className="mb-4">
        <p className="text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
          {item.content_text}
        </p>
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
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={async () => {
            setIsProcessing('approve');
            await onApprove(item);
            setIsProcessing(null);
          }}
          disabled={isProcessing !== null}
          className="flex-1 border border-emerald-500 text-emerald-600 rounded-md py-2.5 px-4 text-sm hover:bg-emerald-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing === 'approve' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Approving...
            </>
          ) : (
            'Approve'
          )}
        </button>
        <button
          onClick={async () => {
            setIsProcessing('reject');
            await onReject(item);
            setIsProcessing(null);
          }}
          disabled={isProcessing !== null}
          className="flex-1 border border-rose-500 text-rose-600 rounded-md py-2.5 px-4 text-sm hover:bg-rose-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing === 'reject' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Rejecting...
            </>
          ) : (
            'Reject'
          )}
        </button>
        <button
          onClick={() => {
            onEdit(item);
          }}
          disabled={isProcessing !== null}
          className="border border-slate-300 rounded-md p-2.5 hover:bg-slate-50 transition-all duration-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export { CleanContentCard };