import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MAPUTO_LOCATIONS } from '../data/mockData';
import type { LocationPoint, RideOption, PaymentMethod } from '../types';
import { MapView } from './MapView';
import { MpesaEmolaModal } from './MpesaEmolaModal';
import { RideReceiptModal } from './RideReceiptModal';
import { Bike, CreditCard, Phone, MessageSquare, Star, CheckCircle, ArrowRight } from 'lucide-react';

export const MotoTaxiView: React.FC = () => {
  const { currentRide, requestRide, cancelRide, completeCurrentRide } = useApp();

  const [origin, setOrigin] = useState<LocationPoint>(MAPUTO_LOCATIONS[0]);
  const [destination, setDestination] = useState<LocationPoint>(MAPUTO_LOCATIONS[1]);
  const [selectedOption, setSelectedOption] = useState<RideOption>('moto_standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Pricing logic in Meticais (MT)
  const fareBase = selectedOption === 'moto_standard' ? 80 : 120;
  const serviceFee = 10;
  const totalMT = fareBase + serviceFee;

  const handleConfirmOrder = () => {
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = async (phone: string) => {
    requestRide({
      service: 'taxi',
      option: selectedOption,
      origin,
      destination,
      fareMT: fareBase,
      serviceFeeMT: serviceFee,
      totalMT,
      paymentMethod,
      phonePayment: phone
    });
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Map & Ride Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Booking Controls / Tracking Panel */}
        <div className="lg:col-span-5 space-y-4">
          {!currentRide ? (
            /* Booking Form (Matching White Screenshot) */
            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900">MOTO TÁXI</h2>
                    <p className="text-[11px] text-gray-500 font-medium">Viaje com segurança e chegue mais rápido.</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                  Maputo
                </span>
              </div>

              {/* Location Selectors */}
              <div className="space-y-3 relative">
                {/* Connecting Line */}
                <div className="absolute left-[17px] top-[26px] bottom-[26px] w-[2px] bg-gradient-to-b from-emerald-500 to-amber-500 z-0" />

                {/* Pickup Origin */}
                <div className="relative z-10">
                  <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                    De (Origem)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                    <select
                      value={origin.name}
                      onChange={(e) => {
                        const found = MAPUTO_LOCATIONS.find((l) => l.name === e.target.value);
                        if (found) setOrigin(found);
                      }}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    >
                      {MAPUTO_LOCATIONS.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Destination */}
                <div className="relative z-10">
                  <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    Para (Destino)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
                    <select
                      value={destination.name}
                      onChange={(e) => {
                        const found = MAPUTO_LOCATIONS.find((l) => l.name === e.target.value);
                        if (found) setDestination(found);
                      }}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                    >
                      {MAPUTO_LOCATIONS.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Ride Option Choice (Matching screenshot: Moto vs Moto Plus) */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-gray-900">Escolha o tipo de viagem</label>
                
                <div className="space-y-2">
                  {/* Moto Standard */}
                  <button
                    type="button"
                    onClick={() => setSelectedOption('moto_standard')}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedOption === 'moto_standard'
                        ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center text-lg font-bold border border-amber-500/30">
                        🏍️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-900">Moto</span>
                          <span className="text-[10px] text-gray-500 font-semibold">👤 1</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">Rápido e económico • 2-4 min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-900">80,00 MT</div>
                      <div className="text-[9px] text-emerald-700 font-bold">+10 MT taxa</div>
                    </div>
                  </button>

                  {/* Moto Plus */}
                  <button
                    type="button"
                    onClick={() => setSelectedOption('moto_plus')}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedOption === 'moto_plus'
                        ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-500/30">
                        🏍️⚡
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-900">Moto Plus</span>
                          <span className="text-[10px] text-gray-500 font-semibold">👤 1-2</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">Mais conforto • Capacete extra</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-900">120,00 MT</div>
                      <div className="text-[9px] text-emerald-700 font-bold">+10 MT taxa</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Selected Payment Method Bar */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-medium">Método de pagamento</div>
                    <div className="text-xs font-bold text-gray-900 uppercase">{paymentMethod}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="text-xs font-extrabold text-amber-600 hover:underline"
                >
                  Alterar
                </button>
              </div>

              {/* Confirm Order Button (Matching screenshot bright gold) */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Confirmar pedido ({totalMT.toFixed(2).replace('.', ',')} MT)</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Active Ride Tracking Card (Matching screenshot "A caminho") */
            <div className="p-5 rounded-3xl bg-white border border-emerald-500/40 shadow-xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-base font-extrabold text-gray-900">
                    {currentRide.status === 'searching' ? 'A procurar motorista...' : 'A caminho'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {currentRide.totalMT.toFixed(2).replace('.', ',')} MT
                </span>
              </div>

              {currentRide.status === 'searching' ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                    <Bike className="w-6 h-6 animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    A conectar com os motoristas MOTO GO em Maputo...
                  </p>
                </div>
              ) : (
                <>
                  {/* Driver Card (Matching screenshot: Manuel Ernesto) */}
                  {currentRide.driver && (
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentRide.driver.photo}
                          alt={currentRide.driver.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-gray-900">{currentRide.driver.name}</span>
                            <span className="text-xs text-amber-600 font-bold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500" />
                              {currentRide.driver.rating}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {currentRide.driver.motorbike} • <strong className="text-gray-900">{currentRide.driver.plate}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Call & Chat Buttons */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${currentRide.driver.phone}`}
                          className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => alert(`Mensagem para ${currentRide.driver?.name}: "Já estou na recepção!"`)}
                          className="p-2.5 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Route points */}
                  <div className="space-y-2 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-gray-500 font-medium">De:</span>
                      <span className="font-bold text-gray-900 truncate">{currentRide.origin.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-gray-500 font-medium">Para:</span>
                      <span className="font-bold text-gray-900 truncate">{currentRide.destination.name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={completeCurrentRide}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Simular Chegada ao Destino (Concluir)</span>
                    </button>

                    <button
                      onClick={cancelRide}
                      className="w-full py-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-bold text-xs hover:bg-red-100 transition-all"
                    >
                      Cancelar corrida
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Map */}
        <div className="lg:col-span-7 h-[450px] lg:h-auto min-h-[420px]">
          <MapView
            origin={origin}
            destination={destination}
            activeDriverLocation={
              currentRide?.driver ? { lat: currentRide.driver.lat, lng: currentRide.driver.lng } : null
            }
          />
        </div>
      </div>

      {/* Payment Modal */}
      <MpesaEmolaModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amountMT={totalMT}
        selectedMethod={paymentMethod}
        onSelectMethod={setPaymentMethod}
        onConfirmPayment={handleProcessPayment}
      />

      {/* Receipt Modal */}
      <RideReceiptModal
        ride={currentRide}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
