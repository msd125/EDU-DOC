import React, { useState } from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  studentsCount?: number;
  confirmText?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  studentsCount = 0,
  confirmText = "حذف"
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    if (inputValue.trim() === confirmText) {
      setIsConfirming(true);
      setTimeout(() => {
        onConfirm();
        setInputValue('');
        setIsConfirming(false);
        onClose();
      }, 500);
    }
  };

  const handleClose = () => {
    setInputValue('');
    setIsConfirming(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full 
                           flex items-center justify-center text-white text-xl shadow-lg">
              ⚠️
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600">هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{message}</p>
            
            {studentsCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600 font-semibold">📊 تفاصيل الحذف:</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• سيتم حذف {studentsCount} طالب</li>
                  <li>• سيتم حذف جميع الدرجات والبيانات</li>
                  <li>• لا يمكن استرداد البيانات بعد الحذف</li>
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                للتأكيد، اكتب "{confirmText}" في الحقل أدناه:
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-red-500 focus:border-transparent text-center font-semibold
                         transition-all duration-200"
                placeholder={`اكتب "${confirmText}" هنا`}
                autoFocus
              />
              
              {inputValue && inputValue !== confirmText && (
                <p className="text-red-500 text-sm text-center">
                  ❌ يجب كتابة "{confirmText}" بالضبط
                </p>
              )}
              
              {inputValue === confirmText && (
                <p className="text-green-600 text-sm text-center">
                  ✅ تم التأكيد - يمكنك الآن المتابعة
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 btn-modern btn-secondary py-3 text-sm font-semibold"
            disabled={isConfirming}
          >
            إلغاء
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={inputValue !== confirmText || isConfirming}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 
                      flex items-center justify-center gap-2 ${
              inputValue === confirmText && !isConfirming
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الحذف...
              </>
            ) : (
              <>
                🗑️ تأكيد الحذف
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;