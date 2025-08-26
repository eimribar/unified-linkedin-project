import React from 'react';
import { Check, X, Edit3, RotateCcw } from 'lucide-react';

interface ActionBarProps {
  onApprove: () => void;
  onDecline: () => void;
  onEdit: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  disabled?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onApprove,
  onDecline,
  onEdit,
  onUndo,
  canUndo = false,
  disabled = false
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
      <div className="safe-area-bottom px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Decline Button */}
          <button
            onClick={onDecline}
            disabled={disabled}
            className="flex-1 max-w-[80px] aspect-square bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all duration-200 flex items-center justify-center group"
          >
            <X size={28} className="group-active:scale-90 transition-transform" />
          </button>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            disabled={disabled}
            className="flex-1 max-w-[80px] aspect-square bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all duration-200 flex items-center justify-center group"
          >
            <Edit3 size={28} className="group-active:scale-90 transition-transform" />
          </button>

          {/* Undo Button (if available) */}
          {canUndo && onUndo && (
            <button
              onClick={onUndo}
              className="flex-1 max-w-[60px] aspect-square bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-full shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-200 flex items-center justify-center group"
            >
              <RotateCcw size={20} className="group-active:scale-90 transition-transform" />
            </button>
          )}

          {/* Approve Button */}
          <button
            onClick={onApprove}
            disabled={disabled}
            className="flex-1 max-w-[80px] aspect-square bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all duration-200 flex items-center justify-center group"
          >
            <Check size={28} className="group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Button Labels */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex-1 max-w-[80px] text-center">
            <span className="text-xs font-medium text-red-600">Decline</span>
          </div>
          <div className="flex-1 max-w-[80px] text-center">
            <span className="text-xs font-medium text-blue-600">Edit</span>
          </div>
          {canUndo && (
            <div className="flex-1 max-w-[60px] text-center">
              <span className="text-xs font-medium text-gray-600">Undo</span>
            </div>
          )}
          <div className="flex-1 max-w-[80px] text-center">
            <span className="text-xs font-medium text-green-600">Approve</span>
          </div>
        </div>
      </div>
    </div>
  );
};