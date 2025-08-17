import React from 'react';
import { Settings } from '../types';
import { MenuIcon, TuneIcon, LogoutIcon } from './Icons';

interface HeaderProps {
    settings: Settings;
    onToggleSidebar: () => void;
    onOpenSettings: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ settings, onToggleSidebar, onOpenSettings, onLogout }) => {
    return (
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 p-4 flex justify-between items-center z-20 shrink-0">
            <div className="flex items-center gap-4">
                 <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                    aria-label="فتح/إغلاق القائمة"
                    data-tooltip="القائمة"
                >
                    <MenuIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{settings.schoolName}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{settings.teacherName}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onOpenSettings}
                    className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                    aria-label="الإعدادات"
                    data-tooltip="الإعدادات"
                >
                    <TuneIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </button>
                 <button
                    onClick={onLogout}
                    className="p-2 rounded-full hover:bg-red-500/10 transition-colors"
                    aria-label="تسجيل الخروج"
                    data-tooltip="تسجيل الخروج"
                >
                    <LogoutIcon className="w-6 h-6 text-red-500" />
                </button>
            </div>
      </header>
    );
};

export default Header;
