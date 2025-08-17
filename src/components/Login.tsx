import React, { useState } from 'react';
import { PhoneIcon, LockIcon } from './Icons';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mobileNumber, setMobileNumber] = useState('0501234567');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber === '0501234567' && password === '123456') {
      onLogin(mobileNumber);
    } else {
      setError('رقم الجوال أو كلمة المرور غير صحيحة.');
    }
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
        </form>
         <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            للتجربة: استخدم 0501234567 / 123456
         </p>
      </div>
    </div>
  );
};

export default Login;