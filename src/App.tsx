import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MotoTaxiView } from './components/MotoTaxiView';
import { MotoFoodView } from './components/MotoFoodView';
import { MotoDeliveryView } from './components/MotoDeliveryView';
import { DriverDashboardView } from './components/DriverDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { WalletModal } from './components/WalletModal';
import { Bike, Utensils, Package, Heart } from 'lucide-react';

export function App() {
  const { role, rideHistory } = useApp();
  const [activeTab, setActiveTab] = useState<'taxi' | 'food' | 'delivery'>('taxi');
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 flex flex-col font-sans antialiased">
      {/* Top Navbar Header */}
      <Navbar 
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Render View based on Active Role */}
        {role === 'driver' ? (
          /* Aplicação do Motociclista */
          <DriverDashboardView />
        ) : role === 'admin' ? (
          /* Painel Administrativo Web */
          <AdminDashboardView />
        ) : (
          /* Aplicação do Cliente */
          <div className="space-y-6">
            {/* Top Navigation Tabs: Moto Táxi | Moto Food | Moto Delivery */}
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
              {/* Tab 1: Moto Táxi */}
              <button
                onClick={() => setActiveTab('taxi')}
                className={`p-4 rounded-3xl border transition-all text-left flex items-center gap-3 relative overflow-hidden group ${
                  activeTab === 'taxi'
                    ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-transform group-hover:scale-110 ${
                  activeTab === 'taxi' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'bg-gray-100 text-amber-600'
                }`}>
                  <Bike className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-gray-900">MOTO TÁXI</h3>
                  <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Viaje com segurança e rapidez</p>
                </div>
                {activeTab === 'taxi' && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>

              {/* Tab 2: Moto Food */}
              <button
                onClick={() => setActiveTab('food')}
                className={`p-4 rounded-3xl border transition-all text-left flex items-center gap-3 relative overflow-hidden group ${
                  activeTab === 'food'
                    ? 'bg-emerald-500/10 border-emerald-400 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-transform group-hover:scale-110 ${
                  activeTab === 'food' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-gray-100 text-emerald-600'
                }`}>
                  <Utensils className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-gray-900">MOTO FOOD</h3>
                  <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Refeições favoritas entregues</p>
                </div>
                {activeTab === 'food' && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>

              {/* Tab 3: Moto Delivery */}
              <button
                onClick={() => setActiveTab('delivery')}
                className={`p-4 rounded-3xl border transition-all text-left flex items-center gap-3 relative overflow-hidden group ${
                  activeTab === 'delivery'
                    ? 'bg-blue-500/10 border-blue-400 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-transform group-hover:scale-110 ${
                  activeTab === 'delivery' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-gray-100 text-blue-600'
                }`}>
                  <Package className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-gray-900">MOTO DELIVERY</h3>
                  <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Enviamos o que precisa</p>
                </div>
                {activeTab === 'delivery' && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Render Selected Module Content */}
            {activeTab === 'taxi' && <MotoTaxiView />}
            {activeTab === 'food' && <MotoFoodView />}
            {activeTab === 'delivery' && <MotoDeliveryView />}
          </div>
        )}
      </main>

      {/* Wallet Modal */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />

      {/* History Drawer Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900">Histórico de Viagens & Pedidos</h3>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="px-3 py-1 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-3">
              {rideHistory.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">Nenhuma corrida realizada ainda.</p>
              ) : (
                rideHistory.map((ride) => (
                  <div key={ride.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="uppercase text-amber-600 font-extrabold">{ride.service} ({ride.id})</span>
                      <span className="text-emerald-700 font-black text-sm">{ride.totalMT.toFixed(2).replace('.', ',')} MT</span>
                    </div>
                    <div className="text-gray-600">
                      <strong>De:</strong> {ride.origin.name}
                    </div>
                    <div className="text-gray-600">
                      <strong>Para:</strong> {ride.destination.name}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-200 pt-2">
                      <span>Pagamento: {ride.paymentMethod.toUpperCase()}</span>
                      <span>{ride.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modern Light Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6 px-4 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <img src="/MOTO GO LOGOTIPO.png" alt="MOTO GO" className="h-6 w-auto" />
          <span className="font-bold text-gray-800">MOTO GO Moçambique 🇲🇿</span>
        </div>
        <p>Serviço oficial de Moto Táxi, Moto Food e Moto Delivery com pagamentos M-Pesa & e-Mola.</p>
        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
          <span>Desenvolvido com</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span>em Maputo, Moçambique.</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
