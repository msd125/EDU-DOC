
import React, { useState, useEffect } from 'react';

// مكتبة مؤثرات confetti خفيفة (بدون تثبيت خارجي)
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

const WHATS_NEW_KEY = 'whatsNew_2025_09_01';

const features = [
  { icon: '�', title: 'تخصيص متقدم للجدول', desc: [
    '🎨 يمكنك الآن تغيير لون النص والخلفية، حجم الخط، ومحاذاة كل خلية بشكل مستقل.',
    '💾 التخصيصات تحفظ تلقائيًا وتبقى بعد تحديث الصفحة.'
  ] },
  { icon: '�', title: 'تصدير تقارير مطابقة للتخصيصات', desc: [
    '🖨️ عند طباعة أو تصدير التقرير (PDF)، تظهر جميع التخصيصات (الألوان، المحاذاة، حجم الخط) كما هي في الشاشة.'
  ] },
  { icon: '�️', title: 'لوحة تخصيص متجاوبة واحترافية', desc: [
    '🟦 تظهر لوحة الألوان دائمًا في وسط الشاشة بحجم متجاوب.',
    '🟥 تعرض فقط الألوان الأساسية (أحمر، أصفر، أخضر، أزرق، أسود، أبيض).',
    '🔒 حجم الخط داخل لوحة التخصيص ثابت ولا يتأثر بتخصيص الخلية.'
  ] },
  { icon: '�', title: 'تحسين تجربة التنقل', desc: [
    '⏮️ عند تغيير الفصل أو المادة، تبدأ دائمًا من الصفحة الأولى تلقائيًا.'
  ] },
];

const howTo = [
  { icon: '�', title: 'على الكمبيوتر', desc: [
    'اضغط زر الفأرة الأيمن على أي خلية في الجدول لفتح لوحة التخصيص.',
    'اختر اللون، حجم الخط، أو المحاذاة التي تريدها.',
    'أغلق اللوحة بعد الانتهاء وسيتم حفظ التخصيص تلقائيًا.'
  ] },
  { icon: '📱', title: 'على الأجهزة الذكية', desc: [
    'اضغط ضغطة مطوّلة (لمدة ثانية تقريبًا) على الخلية التي تريد تخصيصها.',
    'ستظهر لوحة التخصيص في منتصف الشاشة.',
    'عدّل الخيارات ثم أغلق اللوحة للحفظ.'
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
        style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}
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
          <h2 style={{fontWeight:'bold',fontSize:20,marginBottom:10,textAlign:'center',color:'#16a34a',letterSpacing:1}}>🎉 جديد النسخة 2025/09/01</h2>
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
            <div style={{fontWeight:'bold',fontSize:14,marginBottom:4,display:'flex',alignItems:'center',color:'#0284c7'}}><span style={{fontSize:18,marginLeft:7}}>ℹ️</span>كيفية استخدام ميزة التخصيص:</div>
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
            <div style={{fontSize:11,marginTop:6,color:'#555'}}>✨ يمكنك إعادة الخلية للوضع الافتراضي من داخل لوحة التخصيص عبر زر <b>إعادة الافتراضي</b>.</div>
          </div>
          <div style={{marginTop:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <label style={{fontSize:11}}>
              <input type="checkbox" checked={dontShow} onChange={e => setDontShow(e.target.checked)} />
              <span style={{marginRight:6}}>لا تظهر مرة أخرى</span>
            </label>
            <button onClick={handleClose} style={{background:'#16a34a',color:'#fff',border:'none',borderRadius:8,padding:'6px 16px',fontWeight:'bold',fontSize:13,cursor:'pointer',boxShadow:'0 2px 8px #16a34a22'}}>تم</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsNewModal;
