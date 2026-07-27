import React, { useState } from 'react';
import type { RideRequest } from '../types';
import { Star, Calendar, CreditCard, HelpCircle, X } from 'lucide-react';

interface RideReceiptModalProps {
  ride: RideRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RideReceiptModal: React.FC<RideReceiptModalProps> = ({ ride, isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [rated, setRated] = useState(false);

  if (!isOpen || !ride) return null;

  const handleRate = (stars: number) => {
    setRating(stars);
    setRated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl overflow-hidden space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <h3 className="text-base font-black text-gray-900">Detalhes da corrida</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Route details */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-sm" />
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">De</div>
              <div className="text-xs font-black text-gray-900">{ride.origin.name}</div>
              <div className="text-[11px] text-gray-500">{ride.origin.address}</div>
            </div>
          </div>

          <div className="border-l-2 border-dashed border-gray-300 ml-1 pl-5 my-1" />

          <div className="flex items-start gap-3">
            <div className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-sm" />
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Para</div>
              <div className="text-xs font-black text-gray-900">{ride.destination.name}</div>
              <div className="text-[11px] text-gray-500">{ride.destination.address}</div>
            </div>
          </div>
        </div>

        {/* Date & Payment */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-500">Data</div>
              <div className="font-bold text-gray-900 text-[11px]">{ride.date}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-500">Pagamento</div>
              <div className="font-bold text-gray-900 uppercase text-[11px]">{ride.paymentMethod}</div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600 font-medium">
            <span>Preço da corrida</span>
            <span className="font-bold text-gray-900">{ride.fareMT.toFixed(2).replace('.', ',')} MT</span>
          </div>

          <div className="flex justify-between text-gray-600 font-medium">
            <span>Taxa de serviço</span>
            <span className="font-bold text-gray-900">{ride.serviceFeeMT.toFixed(2).replace('.', ',')} MT</span>
          </div>

          <div className="border-t border-gray-200 pt-2.5 mt-2 flex justify-between items-center text-gray-900">
            <span className="font-black text-sm">Total</span>
            <span className="font-black text-lg text-emerald-600">
              {ride.totalMT.toFixed(2).replace('.', ',')} MT
            </span>
          </div>
        </div>

        {/* Rating Section */}
        <div className="text-center bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-gray-700">
            {rated ? 'Obrigado pela sua avaliação!' : 'Avaliar corrida'}
          </div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                className="p-1 hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Suporte MOTO GO Moçambique: Contato via WhatsApp / Chamada +258 84 000 1122')}
            className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Precisa de ajuda?</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
