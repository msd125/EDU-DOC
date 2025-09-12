import React, { useEffect } from 'react';

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  useEffect(() => {
    if (isOpen) {
      // إنشاء element جديد مباشرة في body
      const modal = document.createElement('div');
      modal.id = 'edu-doc-modal-' + Date.now();
      
      // CSS مباشر للعنصر
      modal.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: rgba(0, 0, 0, 0.6) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 2147483647 !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        direction: rtl !important;
      `;

      // المحتوى الداخلي
      modal.innerHTML = `
        <div style="
          background-color: white !important;
          border-radius: 8px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
          padding: 24px !important;
          width: 100% !important;
          max-width: 400px !important;
          margin: 16px !important;
          transform: scale(1) !important;
          transition: all 0.3s ease !important;
        " onclick="event.stopPropagation()">
          <!-- Header -->
          <div style="
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            margin-bottom: 16px !important;
          ">
            <div style="
              width: 32px !important;
              height: 32px !important;
              background: #ef4444 !important;
              border-radius: 50% !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              color: white !important;
              font-size: 16px !important;
            ">⚠️</div>
            <h2 style="
              font-size: 20px !important;
              font-weight: bold !important;
              color: #1f2937 !important;
              margin: 0 !important;
            ">${title}</h2>
          </div>

          <!-- Content -->
          <p style="
            margin: 24px 0 !important;
            color: #374151 !important;
            line-height: 1.6 !important;
            white-space: pre-line !important;
          ">${message}</p>

          <!-- Actions -->
          <div style="
            display: flex !important;
            justify-content: flex-end !important;
            gap: 16px !important;
            margin-top: 32px !important;
            padding-top: 16px !important;
            border-top: 1px solid #e5e7eb !important;
          ">
            <button onclick="window.eduDocModalCancel()" style="
              padding: 8px 16px !important;
              font-size: 14px !important;
              font-weight: 500 !important;
              color: #374151 !important;
              background-color: white !important;
              border-radius: 8px !important;
              border: 1px solid #d1d5db !important;
              cursor: pointer !important;
            ">إلغاء</button>
            <button onclick="window.eduDocModalConfirm()" style="
              padding: 8px 16px !important;
              font-size: 14px !important;
              font-weight: 500 !important;
              color: white !important;
              background-color: #ef4444 !important;
              border-radius: 8px !important;
              border: none !important;
              cursor: pointer !important;
            ">تأكيد الحذف</button>
          </div>
        </div>
      `;

      // إضافة event listeners عالمية
      (window as any).eduDocModalCancel = () => {
        document.body.removeChild(modal);
        delete (window as any).eduDocModalCancel;
        delete (window as any).eduDocModalConfirm;
        document.body.style.overflow = '';
        onClose();
      };

      (window as any).eduDocModalConfirm = () => {
        const confirmBtn = modal.querySelector('button[onclick="window.eduDocModalConfirm()"]') as HTMLElement;
        if (confirmBtn) {
          confirmBtn.innerHTML = `
            <div style="
              width: 12px; height: 12px; 
              border: 2px solid rgba(255, 255, 255, 0.3); 
              border-top: 2px solid white; 
              border-radius: 50%; 
              animation: spin 1s linear infinite; 
              display: inline-block; 
              margin-left: 5px;
            "></div>
            جاري الحذف...
          `;
          confirmBtn.style.opacity = '0.5';
        }
        
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
          delete (window as any).eduDocModalCancel;
          delete (window as any).eduDocModalConfirm;
          document.body.style.overflow = '';
          onConfirm();
        }, 300);
      };

      // النقر على الخلفية
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          (window as any).eduDocModalCancel();
        }
      });

      // منع scroll
      document.body.style.overflow = 'hidden';
      
      // إضافة CSS للـ animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      // إضافة للـ body
      document.body.appendChild(modal);

      return () => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
        document.body.style.overflow = '';
        delete (window as any).eduDocModalCancel;
        delete (window as any).eduDocModalConfirm;
        const spinStyle = document.querySelector('style');
        if (spinStyle && spinStyle.textContent?.includes('spin')) {
          document.head.removeChild(spinStyle);
        }
      };
    }
  }, [isOpen, onClose, onConfirm, title, message]);

  return null;
};

export default ConfirmPopup;