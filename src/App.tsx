import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MotoTaxiView } from './components/MotoTaxiView';
import { MotoFoodView } from './components/MotoFoodView';
import { MotoDeliveryView } from './components/MotoDeliveryView';
import { DriverDashboardView } from './components/DriverDashboardView';
import { WalletModal } from './components/WalletModal';
import { RideReceiptModal } from './components/RideReceiptModal';
import type { ServiceType } from './types';
import { ShieldCheck, Headphones, Wallet, Zap, History, X } from 'lucide-react';

const MainApp: React.FC = () => {
  const { role, rideHistory } = useApp();
  const [activeTab, setActiveTab] = useState<ServiceType>('taxi');
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedHistoryRide, setSelectedHistoryRide] = useState<any | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-white">
      {/* Header Navbar */}
      <Navbar
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {role === 'passenger' ? (
          <>
            {/* Service Navigation Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {/* MOTO TÁXI Tab */}
              <button
                onClick={() => setActiveTab('taxi')}
                className={`p-4 rounded-3xl border transition-all text-left flex items-center justify-between group relative overflow-hidden ${
                  activeTab === 'taxi'
                    ? 'bg-gradient-to-r from-amber-500/20 via-gray-900 to-gray-900 border-amber-500 shadow-xl shadow-amber-500/10'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110 ${
                      activeTab === 'taxi'
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                        : 'bg-gray-800 text-amber-400'
                    }`}
                  >
                    🏍️
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">MOTO TÁXI</div>
                    <div className="text-[10px] text-gray-400 font-semibold hidden sm:block">
                      Viaje com segurança e rapidez
                    </div>
                  </div>
                </div>
                {activeTab === 'taxi' && (
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                )}
              </button>

              {/* MOTO FOOD Tab */}
              <button
                onClick={() => setActiveTab('food')}
                className={`p-4 rounded-3xl border transition-all text-left flex items-center justify-between group relative overflow-hidden ${
                  activeTab === 'food'
                    ? 'bg-gradient-to-r from-amber-500/20 via-gray-900 to-gray-900 border-amber-500 shadow-xl shadow-amber-500/10'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110 ${
                      activeTab === 'food'
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                        : 'bg-gray-800 text-amber-400'
                    }`}
                  >
                    🍕
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">MOTO FOOD</div>
                    <div className="text-[10px] text-gray-400 font-semibold hidden sm:block">
                      Refeições favoritas entregues
                    </div>
                  </div>
                </div>
                {activeTab === 'food' && (
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                )}
              </button>

              {/* MOTO DELIVERY Tab */}
              <button
                onClick={() => setActiveTab('delivery')}
                className={`p-4 rounded-3xl border transition-all text-left flex items-center justify-between group relative overflow-hidden ${
                  activeTab === 'delivery'
                    ? 'bg-gradient-to-r from-emerald-500/20 via-gray-900 to-gray-900 border-emerald-500 shadow-xl shadow-emerald-500/10'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110 ${
                      activeTab === 'delivery'
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                        : 'bg-gray-800 text-emerald-400'
                    }`}
                  >
                    📦
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">MOTO DELIVERY</div>
                    <div className="text-[10px] text-gray-400 font-semibold hidden sm:block">
                      Enviamos o que precisa
                    </div>
                  </div>
                </div>
                {activeTab === 'delivery' && (
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                )}
              </button>
            </div>

            {/* Active Service View */}
            {activeTab === 'taxi' && <MotoTaxiView />}
            {activeTab === 'food' && <MotoFoodView />}
            {activeTab === 'delivery' && <MotoDeliveryView />}
          </>
        ) : (
          /* Driver View */
          <DriverDashboardView />
        )}
      </main>

      {/* Footer Feature Badges */}
      <footer className="border-t border-gray-800 bg-gray-900/80 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Seguro</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                Viagens e entregas 100% seguras com motoristas verificados.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Suporte 24/7</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                Estamos sempre disponíveis para ajudar em Maputo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Pagamentos Flexíveis</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                Meticais via M-Pesa, e-Mola, Dinheiro ou MotoSaldo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Feito Para Si</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                Rápido, simples e confiável para Moçambique 🇲🇿.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 mt-6 border-t border-gray-800/80 text-center text-xs text-gray-500 font-medium">
          © 2026 MOTO GO Moçambique. Todos os direitos reservados.
        </div>
      </footer>

      {/* Wallet Modal */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">Histórico de Corridas & Entregas</h3>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="p-1 rounded-xl bg-gray-800 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {rideHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedHistoryRide(item)}
                  className="p-3.5 rounded-2xl bg-gray-800/50 border border-gray-700/60 hover:border-amber-400/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{item.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                        {item.service}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {item.origin.name} ➔ {item.destination.name}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{item.date}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-amber-400">
                      {item.totalMT.toFixed(2).replace('.', ',')} MT
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">{item.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ride Receipt Modal for selected history */}
      {selectedHistoryRide && (
        <RideReceiptModal
          ride={selectedHistoryRide}
          isOpen={!!selectedHistoryRide}
          onClose={() => setSelectedHistoryRide(null)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
