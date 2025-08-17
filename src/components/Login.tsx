import React, { useState } from 'react';
import { PhoneIcon, LockIcon } from './Icons';

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
    if (found || (mobileNumber === '0501234567' && password === '123456')) {
      onLogin(mobileNumber);
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
    setTimeout(() => onLogin(registerData.phone), 300);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
       <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
         <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-slate-100 dark:from-green-900/50 dark:to-slate-900"></div>
       </div>
      <div className="w-full max-w-sm p-8 space-y-6 bg-white/70 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl z-10">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">سجلات المعلم</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">مرحباً بك، الرجاء تسجيل الدخول</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="mobileNumber" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">رقم الجوال</label>
            <div className="relative">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <PhoneIcon className="w-5 h-5 text-slate-400" />
                </span>
                <input
                    type="tel"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full ps-10 p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                    placeholder="05xxxxxxxx"
                />
            </div>
          </div>
          <div>
            <label htmlFor="password"className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">كلمة المرور</label>
             <div className="relative">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <LockIcon className="w-5 h-5 text-slate-400" />
                </span>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full ps-10 p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                />
             </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium transition-all duration-300"
          >
            دخول
          </button>
          <button
            type="button"
            className="w-full px-4 py-3 mt-2 text-[#2E8540] bg-slate-200 rounded-lg hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-green-100 dark:focus:ring-green-800 font-medium transition-all duration-300"
            onClick={() => setShowRegister(true)}
          >
            مستخدم جديد
          </button>
        </form>
         <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            للتجربة: استخدم 0501234567 / 123456
         </p>
      </div>

      {/* نافذة تسجيل مستخدم جديد */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleRegister} className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 w-full max-w-md relative">
            <button type="button" onClick={() => setShowRegister(false)} className="absolute left-4 top-4 text-slate-400 hover:text-red-500 text-2xl">×</button>
            <h3 className="text-xl font-bold mb-4 text-center text-slate-800 dark:text-slate-100">تسجيل مستخدم جديد</h3>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">الاسم الكامل</label>
              <input type="text" value={registerData.name} onChange={e => setRegisterData(d => ({ ...d, name: e.target.value }))} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-slate-100" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">رقم الجوال</label>
              <input type="text" value={registerData.phone} onChange={e => setRegisterData(d => ({ ...d, phone: e.target.value }))} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-slate-100" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">كلمة المرور</label>
              <input type="password" value={registerData.password} onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-slate-100" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">تأكيد كلمة المرور</label>
              <input type="password" value={registerData.confirm} onChange={e => setRegisterData(d => ({ ...d, confirm: e.target.value }))} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-slate-100" />
            </div>
            {registerError && <p className="text-red-500 text-sm mb-3">{registerError}</p>}
            <button type="submit" className="w-full py-2 px-4 bg-[#2E8540] text-white rounded hover:bg-[#246b33] transition-colors font-semibold">تسجيل</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;