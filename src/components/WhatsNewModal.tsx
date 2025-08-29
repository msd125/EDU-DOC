import React, { useState, useEffect } from 'react';

const WHATS_NEW_KEY = 'whatsNew_2025_08_29';

const features = [
  { icon: '🔤', text: 'فرز الأسماء أبجديًا بسهولة.' },
  { icon: '🗂️', text: 'حفظ وتخصيص ترتيب الأعمدة.' },
  { icon: '📦', text: 'تصميم وتصدير/استيراد القوالب.' },
  { icon: '🗑️', text: 'حذف جميع أسماء الفصل بضغطة واحدة.' },
  { icon: '🖨️', text: 'تحسينات الطباعة وتكرار رأس الجدول.' },
  { icon: '⚡', text: 'إشعارات فورية وتحديث تلقائي للصفحة.' },
];

const WhatsNewModal = () => {
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(WHATS_NEW_KEY);
    if (!seen) setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (dontShow) {
      localStorage.setItem(WHATS_NEW_KEY, '1');
    }
  };

  if (!open) return null;

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:18,padding:'32px 24px',maxWidth:400,width:'90%',boxShadow:'0 8px 32px rgba(0,0,0,0.18)',direction:'rtl',textAlign:'right',position:'relative'}}>
        <h2 style={{fontWeight:'bold',fontSize:22,marginBottom:12,textAlign:'center',color:'#16a34a'}}>🎉 جديد النسخة!</h2>
        <ul style={{listStyle:'none',padding:0,margin:0}}>
          {features.map((f,i) => (
            <li key={i} style={{display:'flex',alignItems:'center',margin:'12px 0',fontSize:16}}>
              <span style={{fontSize:22,marginLeft:10}}>{f.icon}</span> {f.text}
            </li>
          ))}
        </ul>
        <div style={{marginTop:24,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <label style={{fontSize:13}}>
            <input type="checkbox" checked={dontShow} onChange={e => setDontShow(e.target.checked)} />
            <span style={{marginRight:6}}>لا تظهر مرة أخرى</span>
          </label>
          <button onClick={handleClose} style={{background:'#16a34a',color:'#fff',border:'none',borderRadius:8,padding:'8px 22px',fontWeight:'bold',fontSize:15,cursor:'pointer'}}>تم</button>
        </div>
      </div>
    </div>
  );
};

export default WhatsNewModal;
