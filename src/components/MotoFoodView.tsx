import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_RESTAURANTS } from '../data/mockData';
import type { PaymentMethod } from '../types';
import { MpesaEmolaModal } from './MpesaEmolaModal';
import { Utensils, ShoppingBag, Star, Clock, Plus, Trash2, CheckCircle, ArrowRight } from 'lucide-react';

export const MotoFoodView: React.FC = () => {
  const { cart, addToCart, removeFromCart, clearCart, cartTotalMT } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const deliveryFeeMT = 60; // 60 MT delivery fee in Maputo
  const grandTotalMT = cartTotalMT + (cart.length > 0 ? deliveryFeeMT : 0);

  const handleConfirmFoodPayment = async (_phone: string) => {
    setOrderConfirmed(true);
    clearCart();
    setTimeout(() => {
      setOrderConfirmed(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Banner matching Moto Food Mockup */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 p-6 sm:p-8 text-black shadow-xl">
        <div className="max-w-md space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-black text-xs font-black uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5" />
            <span>MOTO FOOD MOÇAMBIQUE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight text-gray-950">
            Sua fome, a nossa entrega rápida!
          </h2>
          <p className="text-xs sm:text-sm font-bold opacity-90 text-gray-900">
            Pratos típicos e refeições dos melhores restaurantes de Maputo e Matola direto à sua porta.
          </p>
        </div>
      </div>

      {orderConfirmed && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-between shadow-lg animate-in zoom-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Pedido Moto Food confirmado! O estafeta já está no restaurante a recolhar sua refeição.</span>
          </div>
        </div>
      )}

      {/* Main Grid: Dishes + Cart Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Restaurants & Dishes */}
        <div className="lg:col-span-8 space-y-6">
          {MOCK_RESTAURANTS.map((rest) => (
            <div key={rest.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4">
              {/* Restaurant Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rest.image}
                    alt={rest.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">{rest.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{rest.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {rest.rating}
                  </span>
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {rest.deliveryTime}
                  </span>
                </div>
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rest.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between hover:border-amber-400 hover:bg-white transition-all shadow-sm"
                  >
                    <div className="space-y-2">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-32 rounded-xl object-cover"
                      />
                      <h4 className="text-xs font-bold text-gray-900 leading-snug">{dish.name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2">{dish.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200/80">
                      <span className="text-sm font-black text-amber-600">
                        {dish.priceMT.toFixed(2).replace('.', ',')} MT
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(dish, rest.name)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition-transform active:scale-95 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary / Cart */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 p-5 rounded-3xl bg-white border border-gray-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-gray-900">Seu Pedido</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30">
                {cart.length} itens
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-gray-400 space-y-2">
                <Utensils className="w-10 h-10 mx-auto stroke-1 text-gray-300" />
                <p className="text-xs font-medium text-gray-500">Seu carrinho está vazio.</p>
                <p className="text-[10px] text-gray-400">Escolha pratos deliciosos ao lado para começar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.dish.id}
                      className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex-1 pr-2">
                        <div className="font-bold text-gray-900 truncate">{item.dish.name}</div>
                        <div className="text-[10px] text-amber-600 font-semibold">
                          {(item.dish.priceMT * item.quantity).toFixed(2).replace('.', ',')} MT
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 px-2">x{item.quantity}</span>
                        <button
                          onClick={() => removeFromCart(item.dish.id)}
                          className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{cartTotalMT.toFixed(2).replace('.', ',')} MT</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxa de entrega (Moto GO)</span>
                    <span className="font-medium text-gray-900">{deliveryFeeMT.toFixed(2).replace('.', ',')} MT</span>
                  </div>
                  <div className="flex justify-between items-center font-black text-gray-900 text-base pt-2 border-t border-gray-100">
                    <span>Total em MT</span>
                    <span className="text-amber-600">{grandTotalMT.toFixed(2).replace('.', ',')} MT</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Pagar com M-Pesa / e-Mola</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MpesaEmolaModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        amountMT={grandTotalMT}
        selectedMethod={paymentMethod}
        onSelectMethod={setPaymentMethod}
        onConfirmPayment={handleConfirmFoodPayment}
        title="Pagamento Moto Food"
      />
    </div>
  );
};
