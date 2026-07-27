import React from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Tag, Bike, User } from 'lucide-react';

interface NavbarProps {
  onOpenWallet: () => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWallet, onOpenHistory }) => {
  const { role, setRole, motoSaldo } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-4 py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/20">
            <Bike className="w-6 h-6 text-black font-extrabold stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">MOTO</span>
              <span className="text-xl font-extrabold tracking-tight text-emerald-400">GO</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold uppercase tracking-wider ml-1">
                MZ 🇲🇿
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">A sua vida em movimento, nós levamos mais longe.</p>
          </div>
        </div>

        {/* Role Toggle & Wallet pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Passenger / Driver mode switcher */}
          <div className="bg-gray-800/80 p-1 rounded-xl border border-gray-700/60 flex items-center">
            <button
              onClick={() => setRole('passenger')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'passenger'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Cliente</span>
            </button>
            <button
              onClick={() => setRole('driver')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'driver'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Motorista</span>
            </button>
          </div>

          {/* MotoSaldo Button (Matching screenshot) */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white transition-all shadow-sm group"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-gray-400 font-medium leading-none">MotoSaldo</div>
              <div className="text-xs font-extrabold text-emerald-400 leading-tight">
                {motoSaldo.toFixed(2).replace('.', ',')} MT
              </div>
            </div>
          </button>

          {/* Promos & Notifications */}
          <button 
            onClick={onOpenHistory}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white transition-all relative"
            title="Histórico de Viagens"
          >
            <Tag className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
