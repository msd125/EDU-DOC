import React, { useState } from 'react';
import { PhoneIcon, LockIcon } from './Icons';
import { FULL_VERSION } from '../utils/version';

interface LoginProps {
  onLogin: (username: string) => void;
}


const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mobileNumber, setMobileNumber] = useState('0501234567');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', phone: '', password: '', confirm: '' });
  const [registerError, setRegisterError] = useState('');


  // استرجاع المستخدمين من localStorage
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch {
      return [];
    }
  };
  // حفظ المستخدمين في localStorage
  const saveUsers = (users: any[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const found = users.find((u: any) => u.phone === mobileNumber && u.password === password);
    if (found) {
      sessionStorage.setItem('gradebook-user', found.name);
      onLogin(found.name);
    } else if (mobileNumber === '0501234567' && password === '123456') {
      sessionStorage.setItem('gradebook-user', 'المستخدم التجريبي');
      onLogin('المستخدم التجريبي');
    } else {
      setError('رقم الجوال أو كلمة المرور غير صحيحة.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    if (!registerData.name || !registerData.phone || !registerData.password || !registerData.confirm) {
      setRegisterError('جميع الحقول مطلوبة');
      return;
    }
    if (registerData.password !== registerData.confirm) {
      setRegisterError('كلمتا المرور غير متطابقتين');
      return;
    }
    const users = getUsers();
    if (users.find((u: any) => u.phone === registerData.phone)) {
      setRegisterError('رقم الجوال مستخدم مسبقًا');
      return;
    }
    users.push({ name: registerData.name, phone: registerData.phone, password: registerData.password });
    saveUsers(users);
    setShowRegister(false);
    setMobileNumber(registerData.phone);
    setPassword(registerData.password);
    setRegisterData({ name: '', phone: '', password: '', confirm: '' });
    setTimeout(() => {
      sessionStorage.setItem('gradebook-user', registerData.name);
      onLogin(registerData.name);
    }, 300);
  };

  return (
    <>
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-100 via-slate-100 to-emerald-200 relative justify-between overflow-x-hidden">
    {/* خلفية زجاجية مع تدرجات وألوان أكثر حيوية */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/60 via-white/60 to-emerald-100/70 blur-xl"></div>
      <div className="absolute -top-32 -end-32 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -start-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-2xl"></div>
    </div>

    {/* محتوى الصفحة */}
    <main className="flex flex-1 items-center justify-center z-10 w-full px-2 py-8">
        {showRegister ? (
          <div className="w-full max-w-sm p-8 space-y-6 bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 ring-1 ring-emerald-200/40 relative mx-auto animate-scale-in" style={{boxShadow:'0 8px 32px 0 rgba(34,197,94,0.10), 0 1.5px 8px 0 rgba(16,185,129,0.10)'}}>
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-slate-900">تسجيل مستخدم جديد</h2>
            </div>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">الاسم</label>
                <input type="text" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">رقم الجوال</label>
                <input type="tel" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" required placeholder="05xxxxxxxx" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">كلمة المرور</label>
                <input type="password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">تأكيد كلمة المرور</label>
                <input type="password" value={registerData.confirm} onChange={e => setRegisterData({ ...registerData, confirm: e.target.value })} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" required />
              </div>
              {registerError && <p className="text-sm text-red-500 text-center">{registerError}</p>}
              <div className="flex gap-2">
                <button type="submit" className="btn-3d w-full px-4 py-2 text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium transition-all duration-300">تسجيل</button>
                <button type="button" className="btn-3d w-full px-4 py-2 text-[#2E8540] bg-slate-200 rounded-lg hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-green-100 font-medium transition-all duration-300" onClick={() => setShowRegister(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-sm p-8 space-y-6 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 ring-1 ring-emerald-200/40 relative mx-auto animate-scale-in" style={{boxShadow:'0 8px 32px 0 rgba(34,197,94,0.10), 0 1.5px 8px 0 rgba(16,185,129,0.10)'}}>
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-emerald-700 drop-shadow-sm mb-1">سجلات المعلم</h1>
              <p className="text-emerald-900/80 mt-2 font-medium">مرحباً بك، الرجاء تسجيل الدخول</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="mobileNumber" className="block mb-2 text-sm font-medium text-slate-700">رقم الجوال</label>
                <div className="relative">
                  <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <PhoneIcon className="w-5 h-5 text-slate-400" />
                  </span>
                  <input
                    type="tel"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full ps-10 p-2.5"
                    required
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-700">كلمة المرور</label>
                <div className="relative">
                  <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <LockIcon className="w-5 h-5 text-slate-400" />
                  </span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full ps-10 p-2.5"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-400 shadow-lg rounded-xl hover:from-emerald-600 hover:to-emerald-500 focus:ring-4 focus:outline-none focus:ring-emerald-200 font-bold text-lg tracking-wide transition-all duration-300 backdrop-blur"
              >
                دخول
              </button>
              <button
                type="button"
                className="w-full px-4 py-3 mt-2 text-emerald-700 bg-white/70 border border-emerald-100 rounded-xl hover:bg-emerald-50 focus:ring-4 focus:outline-none focus:ring-emerald-100 font-semibold transition-all duration-300"
                onClick={() => setShowRegister(true)}
              >
                مستخدم جديد
              </button>
              {/* نص الإهداء تحت زر مستخدم جديد */}
              <div className="w-full text-center pt-4 text-[15px] text-emerald-800/90 font-medium drop-shadow-sm">
                هذه الأداة هدية إلى كل معلم ومعلمة<br />
                <span className="text-emerald-700/80">تطوير وبرمجة المهندس : محمد بن سالم الدوسري</span><br />
                <a href="mailto:msaldossary.sa@gmail.com" className="underline hover:text-emerald-600">msaldossary.sa@gmail.com</a>
                <div className="mt-2 text-xs text-slate-600">الإصدار: {FULL_VERSION}</div>
              </div>
            </form>
          </div>
        )}
      </main>

  </div>
    </>
  );
}

export default Login;
