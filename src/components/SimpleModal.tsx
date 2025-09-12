import React from 'react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* CSS in head */}
      <style>{`
        .edu-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          background: rgba(0, 0, 0, 0.7) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 999999 !important;
          padding: 20px !important;
          font-family: 'Almarai', Arial, sans-serif !important;
          direction: rtl !important;
        }
        
        .edu-modal-content {
          background: white !important;
          border-radius: 12px !important;
          padding: 24px !important;
          max-width: 420px !important;
          width: 100% !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
          animation: modalFadeIn 0.2s ease-out !important;
          transform: scale(1) !important;
        }
        
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .edu-modal-header {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 16px !important;
        }
        
        .edu-modal-icon {
          width: 36px !important;
          height: 36px !important;
          background: #dc2626 !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          font-size: 18px !important;
        }
        
        .edu-modal-title {
          font-size: 18px !important;
          font-weight: bold !important;
          color: #1f2937 !important;
          margin: 0 !important;
        }
        
        .edu-modal-message {
          color: #4b5563 !important;
          line-height: 1.6 !important;
          margin: 16px 0 24px 0 !important;
          white-space: pre-line !important;
        }
        
        .edu-modal-actions {
          display: flex !important;
          gap: 12px !important;
          justify-content: flex-end !important;
        }
        
        .edu-modal-btn {
          padding: 8px 20px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        
        .edu-modal-btn-cancel {
          background: #f3f4f6 !important;
          color: #374151 !important;
        }
        
        .edu-modal-btn-cancel:hover {
          background: #e5e7eb !important;
        }
        
        .edu-modal-btn-confirm {
          background: #dc2626 !important;
          color: white !important;
        }
        
        .edu-modal-btn-confirm:hover {
          background: #b91c1c !important;
        }
      `}</style>
      
      <div 
        className="edu-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="edu-modal-content">
          <div className="edu-modal-header">
            <div className="edu-modal-icon">⚠️</div>
            <h3 className="edu-modal-title">{title}</h3>
          </div>
          
          <div className="edu-modal-message">{message}</div>
          
          <div className="edu-modal-actions">
            <button 
              className="edu-modal-btn edu-modal-btn-cancel"
              onClick={onClose}
            >
              إلغاء
            </button>
            <button 
              className="edu-modal-btn edu-modal-btn-confirm"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              تأكيد الحذف
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleModal;