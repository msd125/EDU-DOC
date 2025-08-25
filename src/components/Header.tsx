import React from 'react';
import { Settings } from '../types';
import { TuneIcon, LogoutIcon } from './Icons';

interface HeaderProps {
    settings: Settings;
    currentUser: string;
    onOpenSettings: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ settings, currentUser, onOpenSettings, onLogout }) => {
    return (
    <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center z-20 shrink-0">
            <div className="flex items-center gap-4">
                {/* زر القائمة (سايدبار) تم إزالته */}
                                <div>
                                        <h1 className="text-xl font-bold text-slate-800">{settings.schoolName}</h1>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                        <span className="text-sm text-slate-500">مرحباً</span>
                                                                                        <span
                                                                                            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white font-bold text-base"
                                                                                            style={{ backgroundColor: '#2E8540' }}
                                                                                            title={currentUser || 'المستخدم'}
                                                                                        >
                                                                                            {(currentUser && currentUser.trim().charAt(0)) || 'م'}
                                                                                        </span>
                                                                                        <span className="text-sm font-semibold text-slate-800">
                                                                                            {currentUser || 'المستخدم'}
                                                                                        </span>
                                                                                </div>
                                </div>
            </div>
            <div className="flex items-center gap-2">
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
