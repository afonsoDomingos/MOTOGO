import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapView } from './MapView';
import { Bike, Power, Navigation, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DriverDashboardView: React.FC = () => {
  const { isDriverOnline, setIsDriverOnline, driverEarningsMT, availableRidesForDriver, acceptRideAsDriver, activeDriver } = useApp();
  const [activeRide, setActiveRide] = useState<any | null>(null);

  const handleAccept = (ride: any) => {
    acceptRideAsDriver(ride.id);
    setActiveRide(ride);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner Driver Status */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Driver Profile */}
        <div className="flex items-center gap-4">
          <img
            src={activeDriver.photo}
            alt={activeDriver.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md shadow-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">{activeDriver.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                Motorista MOTO GO
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {activeDriver.motorbike} • <strong className="text-amber-400">{activeDriver.plate}</strong> • ⭐ {activeDriver.rating}
            </p>
          </div>
        </div>

        {/* Status Toggle & Earnings counter */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ganhos de Hoje</div>
            <div className="text-2xl font-black text-emerald-400">
              {driverEarningsMT.toFixed(2).replace('.', ',')} MT
            </div>
          </div>

          <button
            onClick={() => setIsDriverOnline(!isDriverOnline)}
            className={`px-4 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all ${
              isDriverOnline
                ? 'bg-emerald-500 text-black shadow-emerald-500/30 hover:bg-emerald-400'
                : 'bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isDriverOnline ? 'ONLINE (Em Serviço)' : 'OFFLINE'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Incoming requests & Live Navigation Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Requests */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-gray-900 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Chamadas de Passageiros ({availableRidesForDriver.length})</span>
              </h3>
              {isDriverOnline && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>

            {!isDriverOnline ? (
              <div className="py-8 text-center text-gray-500 space-y-2">
                <ShieldAlert className="w-8 h-8 mx-auto text-gray-600" />
                <p className="text-xs font-bold">Você está Offline.</p>
                <p className="text-[10px]">Fique Online para receber solicitações de corridas em Maputo.</p>
              </div>
            ) : availableRidesForDriver.length === 0 && !activeRide ? (
              <div className="py-8 text-center text-gray-500 space-y-2">
                <Bike className="w-8 h-8 mx-auto text-emerald-400/50 animate-bounce" />
                <p className="text-xs font-bold text-gray-300">A aguardar novos passageiros...</p>
                <p className="text-[10px] text-gray-500">
                  Mantenha-se perto de zonas de movimento (Av. Julius Nyerere, Baixa, Polana).
                </p>
              </div>
            ) : activeRide ? (
              /* Active Navigation View for Driver */
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center text-xs font-black text-emerald-400">
                  <span>CORRIDA EM ANDAMENTO</span>
                  <span>+{activeRide.fareMT.toFixed(2)} MT</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px]">RECOLHER PASSAGEIRO EM:</span>
                    <div className="font-bold text-white">{activeRide.origin.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">ENTREGAR EM:</span>
                    <div className="font-bold text-white">{activeRide.destination.name}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert('Corrida concluída com sucesso! Valor creditado no seu MotoSaldo.');
                    setActiveRide(null);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluir Corrida & Receber {activeRide.fareMT} MT</span>
                </button>
              </div>
            ) : (
              /* List of Ride Requests */
              <div className="space-y-3">
                {availableRidesForDriver.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-gray-800/60 border border-gray-700/60 hover:border-emerald-500/50 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-amber-400 uppercase">
                        {req.service === 'taxi' ? 'MOTO TÁXI' : 'MOTO DELIVERY'}
                      </span>
                      <span className="text-sm font-black text-emerald-400">
                        {req.fareMT.toFixed(2).replace('.', ',')} MT
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">De: {req.origin.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate">Para: {req.destination.name}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/50 text-[10px] text-gray-400">
                      <span>Pagamento via {req.paymentMethod.toUpperCase()}</span>
                      <span>⏱️ 2,6 km</span>
                    </div>

                    <button
                      onClick={() => handleAccept(req)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aceitar Corrida</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Map Navigation */}
        <div className="lg:col-span-7 min-h-[420px] h-[450px] lg:h-auto">
          <MapView
            origin={activeRide?.origin}
            destination={activeRide?.destination}
            activeDriverLocation={{ lat: activeDriver.lat, lng: activeDriver.lng }}
          />
        </div>
      </div>
    </div>
  );
};
