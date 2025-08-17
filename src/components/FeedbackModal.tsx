import React from 'react';
import { toast } from 'react-hot-toast';

interface FeedbackModalProps {
  studentName: string;
  feedback: string;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ studentName, feedback, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(feedback);
    toast.success('تم نسخ الملاحظات بنجاح!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 id="feedback-title" className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          ملاحظات مقترحة للطالب: <span className="text-[#2E8540]">{studentName}</span>
        </h2>
        <div className="my-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{feedback}</p>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
          >
            نسخ النص
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
