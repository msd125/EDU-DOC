
import React, { useState, useEffect } from 'react';

// مكتبة مؤثرات const improvements: any = null; // إزالة الكود غير المستخدم تثبيت خارجي)
function Confetti() {
  useEffect(() => {
    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const confs = Array.from({length: 80}, () => ({
      x: Math.random()*W, y: Math.random()*H/2, r: 6+Math.random()*8, d: 2+Math.random()*2, c: `hsl(${Math.random()*360},90%,60%)`, t: Math.random()*Math.PI*2
    }));
    let anim = true;
    function draw() {
      ctx.clearRect(0,0,W,H);
      confs.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 2*Math.PI);
        ctx.fillStyle = f.c;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        f.y += f.d;
        f.x += Math.sin(f.t)*2;
        f.t += 0.02;
        if (f.y > H) { f.y = -10; f.x = Math.random()*W; }
      });
      if (anim) requestAnimationFrame(draw);
    }
    draw();
    return () => { anim = false; };
  }, []);
  return <canvas id="confetti-canvas" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:10000}} />;
}

const WHATS_NEW_KEY = 'whatsNew_2025_09_12';

const features = [
  { icon: '🚀', title: 'تحسينات شاملة للواجهة والأداء', desc: [
    '💫 تصميم حديث بتأثيرات زجاجية (Glassmorphism) متطورة',
    '🎨 نظام ألوان محسن مع تدرجات جميلة للأزرار',
    '📱 استجابة كاملة للأجهزة المختلفة (موبايل، تابلت، ديسكتوب)',
    '⚡ أداء محسن وسرعة في التحميل'
  ] },
  { icon: '🗂️', title: 'إعادة تنظيم شريط الأدوات', desc: [
    '🔄 ترتيب منطقي للأزرار حسب المهام والوظائف',
    '🎯 مجمعة في مجموعات: الإدارة → الإضافة → التصدير → القوالب → الحذف',
    '🌈 ألوان موحدة ومتناسقة لكل مجموعة من الأزرار',
    '📝 تحسين النصوص وتوضيح الوظائف'
  ] },
  { icon: '🗑️', title: 'نظام حذف محسن ومهني', desc: [
    '✅ استبدال رسائل المتصفح برسائل تأكيد احترافية',
    '🔔 رسائل نجاح وخطأ واضحة مع نظام التوست',
    '🏷️ تغيير التسميات لتكون أكثر وضوحاً (حذف كل الأسماء)',
    '🛡️ تأكيدات متعددة لمنع الحذف العرضي'
  ] },
  { icon: '📊', title: 'جدول بحجم الصفحة الكاملة', desc: [
    '�️ الجدول يملأ الشاشة بالكامل بغض النظر عن الحجم',
    '📱 تصميم متجاوب مع تحسينات خاصة للموبايل',
    '🔄 أشرطة تمرير محسنة وسلسة',
    '📏 تعديل تلقائي لأحجام الخط حسب حجم الشاشة'
  ] },
  { icon: '⚙️', title: 'تحسينات الإعدادات', desc: [
    '� السنة الافتراضية تتحدث تلقائياً مع السنة الحالية',
    '💾 حفظ تفضيلات المستخدم بشكل دائم',
    '� تحديث تلقائي للقيم القديمة مرة واحدة فقط',
    '✏️ إمكانية تعديل جميع القيم والاحتفاظ بها'
  ] }
];

const improvements = [
  { icon: '🎨', title: 'تحسينات التصميم', desc: [
    'تأثيرات زجاجية عصرية مع شفافية متدرجة',
    'نظام ألوان متناسق مع تدرجات جميلة',
    'انتقالات سلسة وحركات لطيفة للعناصر',
    'تصميم متجاوب يتكيف مع جميع الأحجام'
  ] },
  { icon: '�', title: 'تحسينات الأداء', desc: [
    'تحميل أسرع للصفحات والمكونات',
    'استهلاك ذاكرة محسن',
    'تمرير سلس في الجداول الكبيرة',
    'استجابة فورية للتفاعلات'
  ] },
  { icon: '🔧', title: 'تحسينات تقنية', desc: [
    'كود محسن ومنظم بشكل أفضل',
    'إصلاح مشاكل التوافق مع المتصفحات',
    'تحسين إدارة الحالة والذاكرة',
    'نظام خطأ محسن مع رسائل واضحة'
  ] }
];

const howTo = [
  { icon: '🎯', title: 'المميزات الجديدة', desc: [
    'جدول بحجم الصفحة الكاملة للاستفادة القصوى من المساحة',
    'أزرار منظمة حسب الوظائف مع ألوان متناسقة',
    'رسائل تأكيد احترافية لجميع العمليات',
    'تحديث تلقائي للسنة في الإعدادات'
  ] },
  { icon: '✨', title: 'التحسينات البصرية', desc: [
    'تصميم عصري بتأثيرات زجاجية متطورة',
    'انتقالات سلسة وحركات لطيفة',
    'استجابة كاملة لجميع أحجام الشاشات',
    'تباين محسن وألوان واضحة'
  ] },
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
    <>
      <Confetti />
      <div
        className="whats-new-modal"
        style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:2147483647,display:'flex',alignItems:'center',justifyContent:'center'}}
        onClick={handleClose}
      >
        <div
          style={{
            background:'#fff',
            borderRadius:18,
            padding:'18px 7vw',
            maxWidth:'min(98vw,420px)',
            width:'96%',
            maxHeight:'90vh',
            boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
            direction:'rtl',
            textAlign:'right',
            position:'relative',
            overflowY:'auto',
            overflowX:'hidden',
            overscrollBehavior:'contain',
            WebkitOverflowScrolling:'touch',
            zIndex:2147483647,
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            style={{
              position:'absolute',top:8,left:8,
              background:'#f87171',color:'#fff',border:'none',borderRadius:'50%',
              width:'clamp(32px,7vw,44px)',height:'clamp(32px,7vw,44px)',fontSize:'clamp(20px,4vw,28px)',
              fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px #f8717122',zIndex:2,display:'flex',alignItems:'center',justifyContent:'center'
            }}
            title="إغلاق"
          >×</button>
          <h2 style={{fontWeight:'bold',fontSize:20,marginBottom:10,textAlign:'center',color:'#16a34a',letterSpacing:1}}>🎉 جديد النسخة 2025/09/12</h2>
          
          {/* مربع الاختيار في الأعلى للوصول السهل على الجوال */}
          <div style={{marginBottom:15,display:'flex',justifyContent:'center'}}>
            <div 
              onClick={() => setDontShow(!dontShow)}
              style={{
                fontSize:12,
                display:'flex',
                alignItems:'center',
                cursor:'pointer',
                padding:'10px 15px',
                userSelect:'none',
                minHeight:'40px',
                borderRadius:'8px',
                border:'2px solid #e5e7eb',
                background:dontShow ? '#f0fdf4' : '#fff',
                transition:'all 0.2s ease',
                boxShadow:'0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <input 
                type="checkbox" 
                checked={dontShow} 
                onChange={e => setDontShow(e.target.checked)}
                style={{
                  marginLeft:10,
                  transform:'scale(1.4)',
                  cursor:'pointer',
                  accentColor:'#16a34a'
                }}
              />
              <span style={{marginRight:8,color:'#374151',fontWeight:dontShow ? 'bold' : 'normal'}}>لا تظهر مرة أخرى</span>
            </div>
          </div>
          
          <div style={{marginBottom:12}}>
            {features.map((f,i) => (
              <div key={i} style={{margin:'12px 0',padding:'8px 8px',borderRadius:10,background:'#f3f4f6',boxShadow:'0 1px 4px #0001'}}>
                <div style={{fontSize:16,fontWeight:'bold',marginBottom:3,display:'flex',alignItems:'center'}}>
                  <span style={{fontSize:20,marginLeft:8}}>{f.icon}</span> {f.title}
                </div>
                <ul style={{listStyle:'none',padding:0,margin:0}}>
                  {f.desc.map((d,ii) => <li key={ii} style={{fontSize:13,margin:'4px 0'}}>{d}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{background:'#e0f2fe',borderRadius:10,padding:'8px 6px',marginBottom:10}}>
            <div style={{fontWeight:'bold',fontSize:14,marginBottom:4,display:'flex',alignItems:'center',color:'#0284c7'}}><span style={{fontSize:18,marginLeft:7}}>✨</span>أبرز التحسينات في هذا الإصدار:</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {howTo.map((h,i) => (
                <div key={i} style={{flex:'1 1 120px',minWidth:100,background:'#fff',borderRadius:8,padding:'7px 5px',marginBottom:4,boxShadow:'0 1px 4px #0001'}}>
                  <div style={{fontWeight:'bold',fontSize:13,marginBottom:2,display:'flex',alignItems:'center'}}><span style={{fontSize:16,marginLeft:6}}>{h.icon}</span>{h.title}</div>
                  <ul style={{listStyle:'none',padding:0,margin:0}}>
                    {h.desc.map((d,ii) => <li key={ii} style={{fontSize:12,margin:'2px 0'}}>{d}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,marginTop:6,color:'#555'}}>🚀 هذا التحديث يركز على تحسين تجربة المستخدم والأداء العام مع تصميم عصري ومتطور.</div>
          </div>
          
          {/* زر الإغلاق بعرض كامل */}
          <div style={{marginTop:15,display:'flex',justifyContent:'center'}}>
            <button 
              onClick={handleClose} 
              style={{
                background:'#16a34a',
                color:'#fff',
                border:'none',
                borderRadius:10,
                padding:'12px 24px',
                fontWeight:'bold',
                fontSize:14,
                cursor:'pointer',
                boxShadow:'0 3px 10px #16a34a33',
                minHeight:'44px',
                minWidth:'200px',
                transition:'all 0.2s ease'
              }}
              onMouseOver={e => (e.target as HTMLButtonElement).style.background = '#15803d'}
              onMouseOut={e => (e.target as HTMLButtonElement).style.background = '#16a34a'}
            >
              تم ✅
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsNewModal;
