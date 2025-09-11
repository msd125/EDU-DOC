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
        <header className="glass sticky top-0 z-50 backdrop-blur-xl border-b border-white/20 shadow-lg">
            <div className="container mx-auto">
                <div className="flex justify-between items-center py-4">
                    {/* Left Section - School Info */}
                    <div className="flex items-center gap-6">
                        <div className="animate-slide-right">
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                                {settings.schoolName}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-600 font-medium">مرحباً</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 
                                                   flex items-center justify-center text-white font-bold text-sm
                                                   shadow-lg transform transition-transform hover:scale-110"
                                        title={currentUser || 'المستخدم'}
                                    >
                                        {(currentUser && currentUser.trim().charAt(0)) || 'م'}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {currentUser || 'المستخدم'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-3 animate-fade-in">
                        {/* Settings Button */}
                        <button
                            onClick={onOpenSettings}
                            className="btn-modern btn-secondary p-3 rounded-xl hover:scale-105 
                                       transition-all duration-200 group"
                            aria-label="الإعدادات"
                            title="الإعدادات"
                        >
                            <TuneIcon className="w-5 h-5 text-gray-600 group-hover:text-green-600 
                                              group-hover:rotate-90 transition-all duration-300" />
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={onLogout}
                            className="btn-modern p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 
                                       hover:from-red-100 hover:to-red-200 border border-red-200
                                       hover:scale-105 transition-all duration-200 group"
                            aria-label="تسجيل الخروج"
                            title="تسجيل الخروج"
                        >
                            <LogoutIcon className="w-5 h-5 text-red-500 group-hover:text-red-600 
                                                  group-hover:rotate-12 transition-all duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
