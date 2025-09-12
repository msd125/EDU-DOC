import React, { useState } from 'react';

interface SimpleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const SimpleConfirmModal: React.FC<SimpleConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false);
      onClose();
    }, 300);
  };

  const handleClose = () => {
    setIsConfirming(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-gray-600 leading-relaxed whitespace-pre-line mb-6">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isConfirming}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                     font-medium transition-all duration-200 disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white 
                     rounded-xl hover:from-red-600 hover:to-red-700 font-medium
                     transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                جاري الحذف...
              </>
            ) : (
              <>
                <span>🗑️</span>
                تأكيد الحذف
              </>
            )}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SimpleConfirmModal;