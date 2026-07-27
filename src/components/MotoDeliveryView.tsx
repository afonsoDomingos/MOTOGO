import React, { useState } from 'react';
import { MAPUTO_LOCATIONS } from '../data/mockData';
import type { PaymentMethod } from '../types';
import { MpesaEmolaModal } from './MpesaEmolaModal';
import { Package, Phone, User, CheckCircle, ArrowRight } from 'lucide-react';

export const MotoDeliveryView: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState(MAPUTO_LOCATIONS[0]);
  const [dropoffLocation, setDropoffLocation] = useState(MAPUTO_LOCATIONS[3]);
  const [recipientName, setRecipientName] = useState('Armando Sitoe');
  const [recipientPhone, setRecipientPhone] = useState('849876543');
  const [packageType, setPackageType] = useState<'small' | 'medium' | 'large'>('small');
  const [observations, setObservations] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliverySent, setDeliverySent] = useState(false);

  // Pricing based on package size
  const fareMap = {
    small: 100,
    medium: 200,
    large: 350
  };
  const totalMT = fareMap[packageType];

  const handleConfirmDeliveryPayment = async (_phone: string) => {
    setDeliverySent(true);
    setTimeout(() => {
      setDeliverySent(false);
    }, 6000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Banner matching Moto Delivery Screen */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 p-6 sm:p-8 text-white shadow-xl text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Package className="w-9 h-9 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white">
            MOTO DELIVERY MOÇAMBIQUE
          </span>
          <h2 className="text-2xl font-black mt-1">Enviar encomenda</h2>
          <p className="text-xs font-bold opacity-90 max-w-sm mx-auto">
            Vamos buscar e entregar por si com rapidez e máxima segurança em Maputo e Matola!
          </p>
        </div>
      </div>

      {deliverySent && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-between shadow-lg animate-in zoom-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Encomenda enviada com sucesso! O estafeta MOTO GO está a caminho da recolha.</span>
          </div>
        </div>
      )}

      {/* Main Delivery Form (Matching screenshot "Enviar encomenda") */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-xl space-y-5">
        {/* Addresses */}
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Endereço de recolha
            </label>
            <select
              value={pickupLocation.name}
              onChange={(e) => {
                const found = MAPUTO_LOCATIONS.find((l) => l.name === e.target.value);
                if (found) setPickupLocation(found);
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              {MAPUTO_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} - {loc.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Endereço de entrega
            </label>
            <select
              value={dropoffLocation.name}
              onChange={(e) => {
                const found = MAPUTO_LOCATIONS.find((l) => l.name === e.target.value);
                if (found) setDropoffLocation(found);
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              {MAPUTO_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} - {loc.address}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipient details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Nome do destinatário</label>
            <div className="relative">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ex: Armando Sitoe"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Celular do destinatário</label>
            <div className="relative">
              <input
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="84 987 6543"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-xs font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Package Type (Small / Medium / Large) */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-gray-900">Tipo de pacote</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPackageType('small')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                packageType === 'small'
                  ? 'bg-emerald-500/10 border-emerald-500 text-gray-900 shadow-md shadow-emerald-500/10'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs font-extrabold">Pequeno</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Até 5kg</div>
              <div className="text-xs font-black text-gray-900 mt-1">100,00 MT</div>
            </button>

            <button
              type="button"
              onClick={() => setPackageType('medium')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                packageType === 'medium'
                  ? 'bg-emerald-500/10 border-emerald-500 text-gray-900 shadow-md shadow-emerald-500/10'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs font-extrabold">Médio</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Até 15kg</div>
              <div className="text-xs font-black text-gray-900 mt-1">200,00 MT</div>
            </button>

            <button
              type="button"
              onClick={() => setPackageType('large')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                packageType === 'large'
                  ? 'bg-emerald-500/10 border-emerald-500 text-gray-900 shadow-md shadow-emerald-500/10'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs font-extrabold">Grande</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Até 30kg</div>
              <div className="text-xs font-black text-gray-900 mt-1">350,00 MT</div>
            </button>
          </div>
        </div>

        {/* Observations */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 block">Observações (opcional)</label>
          <div className="relative">
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Documentos num envelope selado. Chamar ao chegar ao portão."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>Confirmar Envio ({totalMT.toFixed(2).replace('.', ',')} MT)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <MpesaEmolaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amountMT={totalMT}
        selectedMethod={paymentMethod}
        onSelectMethod={setPaymentMethod}
        onConfirmPayment={handleConfirmDeliveryPayment}
        title="Pagamento Moto Delivery"
      />
    </div>
  );
};
