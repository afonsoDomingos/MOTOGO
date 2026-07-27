import React from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Tag, Bike, User, Database } from 'lucide-react';

interface NavbarProps {
  onOpenWallet: () => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWallet, onOpenHistory }) => {
  const { role, setRole, motoSaldo, isMongoConnected } = useApp();

  return (
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

        {/* Role Toggle & Wallet pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Passenger / Driver mode switcher */}
          <div className="bg-gray-100 p-1 rounded-xl border border-gray-200 flex items-center">
            <button
              onClick={() => setRole('passenger')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'passenger'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Cliente</span>
            </button>
            <button
              onClick={() => setRole('driver')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'driver'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Motorista</span>
            </button>
          </div>

          {/* MotoSaldo Button */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 transition-all shadow-sm group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-gray-500 font-medium leading-none">MotoSaldo</div>
              <div className="text-xs font-black text-emerald-600 leading-tight">
                {motoSaldo.toFixed(2).replace('.', ',')} MT
              </div>
            </div>
          </button>

          {/* Promos & Notifications */}
          <button 
            onClick={onOpenHistory}
            className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition-all relative"
            title="Histórico de Viagens"
          >
            <Tag className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
