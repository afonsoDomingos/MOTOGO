import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';
import { ImageUploadModal } from './ImageUploadModal';
import { Wallet, Tag, Bike, User, ShieldCheck, Database, LogIn, Camera, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenWallet: () => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWallet, onOpenHistory }) => {
  const { role, setRole, motoSaldo, currentUser, logoutUser, updateProfilePhoto, isMongoConnected } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhotoUploaded = (url: string) => {
    updateProfilePhoto(url);
  };

  const handleLogout = () => {
    logoutUser();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-2.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Official Brand Logo & MongoDB Badge */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <img 
                src="/MOTO GO LOGOTIPO.png" 
                alt="MOTO GO Logo" 
                className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 font-extrabold uppercase tracking-wider">
                MOÇAMBIQUE 🇲🇿
              </span>

              {isMongoConnected && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold flex items-center gap-1 shadow-sm">
                  <Database className="w-3 h-3" />
                  <span>MongoDB motogodb</span>
                </span>
              )}
            </div>
          </div>

          {/* 3 Interfaces Switcher & User Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 3 Interfaces Switcher: Cliente | Motorista | Admin Web */}
            <div className="bg-gray-100 p-1 rounded-xl border border-gray-200 flex items-center gap-0.5">
              <button
                onClick={() => setRole('passenger')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'passenger'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Aplicação do Cliente (cliente@motogo.com)"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Cliente</span>
              </button>

              <button
                onClick={() => setRole('driver')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'driver'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Aplicação do Motociclista (motorista@motogo.com)"
              >
                <Bike className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Motociclista</span>
              </button>

              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Painel Administrativo Web (admin@motogo.com)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Painel Admin</span>
              </button>
            </div>

            {/* MotoSaldo Button (Only shown in passenger view) */}
            {role === 'passenger' && (
              <button
                onClick={onOpenWallet}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 transition-all shadow-sm group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-gray-500 font-medium leading-none">MotoSaldo</div>
                  <div className="text-xs font-black text-emerald-600 leading-tight">
                    {motoSaldo.toFixed(2).replace('.', ',')} MT
                  </div>
                </div>
              </button>
            )}

            {/* User Account & Logout Menu */}
            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center gap-2 text-xs font-bold text-gray-900 transition-all shadow-sm"
                >
                  {currentUser.photo ? (
                    <img src={currentUser.photo} alt="Avatar" className="w-7 h-7 rounded-full object-cover border-2 border-emerald-500 shadow-xs" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-[11px] border border-emerald-500 shadow-xs">
                      {currentUser.name[0]}
                    </div>
                  )}
                  <span className="hidden lg:inline font-black">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in">
                    {/* User Info Header */}
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="font-extrabold text-xs text-gray-900 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-gray-500 truncate font-medium">{currentUser.email}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-black text-[9px] uppercase">
                        {currentUser.role}
                      </span>
                    </div>

                    {/* Action 1: Upload Photo */}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsUploadModalOpen(true);
                      }}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Alterar Foto de Perfil</span>
                    </button>

                    {/* Action 2: Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar / Registar</span>
              </button>
            )}

            {/* Promos & History */}
            {role === 'passenger' && (
              <button 
                onClick={onOpenHistory}
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition-all relative"
                title="Histórico de Viagens"
              >
                <Tag className="w-4 h-4 text-amber-500" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login & Register Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Cloudinary Image Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Atualizar Foto de Perfil (Cloudinary dnvnftvky)"
        onImageUploaded={handlePhotoUploaded}
      />
    </>
  );
};
