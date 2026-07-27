import React, { useState } from 'react';
import type { PaymentMethod } from '../types';
import { Phone, CheckCircle, ShieldAlert, Lock, Smartphone, Wallet, Banknote, ArrowRight, Loader2, X } from 'lucide-react';

interface MpesaEmolaModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountMT: number;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  onConfirmPayment: (phone: string) => Promise<void>;
  title?: string;
}

export const MpesaEmolaModal: React.FC<MpesaEmolaModalProps> = ({
  isOpen,
  onClose,
  amountMT,
  selectedMethod,
  onSelectMethod,
  onConfirmPayment,
  title = 'Método de Pagamento'
}) => {
  const [phoneNumber, setPhoneNumber] = useState('841234567');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'select' | 'push_sent' | 'enter_pin' | 'success'>('select');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleInitiatePayment = async () => {
    setErrorMsg('');

    if (selectedMethod === 'cash') {
      await onConfirmPayment('');
      onClose();
      return;
    }

    if (selectedMethod === 'wallet') {
      await onConfirmPayment('');
      onClose();
      return;
    }

    // Validate Vodacom/Movitel prefix
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (selectedMethod === 'mpesa') {
      if (!cleanPhone.startsWith('84') && !cleanPhone.startsWith('85')) {
        setErrorMsg('O número M-Pesa deve começar com 84 ou 85 (Vodacom Moçambique).');
        return;
      }
    } else if (selectedMethod === 'emola') {
      if (!cleanPhone.startsWith('86') && !cleanPhone.startsWith('87')) {
        setErrorMsg('O número e-Mola deve começar com 86 ou 87 (Movitel Moçambique).');
        return;
      }
    }

    if (cleanPhone.length < 9) {
      setErrorMsg('Digite um número válido de 9 dígitos de Moçambique.');
      return;
    }

    // Move to simulated USSD Push
    setStep('push_sent');
    setTimeout(() => {
      setStep('enter_pin');
    }, 1800);
  };

  const handleConfirmPin = async () => {
    if (pin.length < 4) {
      setErrorMsg('Digite os 4 dígitos do seu PIN M-Pesa / e-Mola.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await onConfirmPayment(phoneNumber);
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        setStep('select');
        setPin('');
        onClose();
      }, 1500);
    } catch {
      setLoading(false);
      setErrorMsg('Falha ao processar pagamento. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              🇲🇿
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">{title}</h3>
              <p className="text-xs text-gray-400">Pagamento seguro em Meticais (MT)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Amount Badge */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-800/60 border border-gray-700/80 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total a Pagar</span>
          <span className="text-2xl font-black text-emerald-400">{amountMT.toFixed(2).replace('.', ',')} MT</span>
        </div>

        {step === 'select' && (
          <div className="space-y-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Escolha a forma de pagamento:
            </label>

            {/* Option Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* M-Pesa Vodacom */}
              <button
                type="button"
                onClick={() => onSelectMethod('mpesa')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 relative ${
                  selectedMethod === 'mpesa'
                    ? 'bg-red-950/40 border-red-500 text-white shadow-lg shadow-red-500/10'
                    : 'bg-gray-800/50 border-gray-700/60 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 font-black flex items-center justify-center text-sm border border-red-500/30">
                  M
                </div>
                <div>
                  <div className="text-xs font-bold text-white">M-Pesa</div>
                  <div className="text-[10px] text-gray-400">Vodacom (84/85)</div>
                </div>
                {selectedMethod === 'mpesa' && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* e-Mola Movitel */}
              <button
                type="button"
                onClick={() => onSelectMethod('emola')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 relative ${
                  selectedMethod === 'emola'
                    ? 'bg-orange-950/40 border-orange-500 text-white shadow-lg shadow-orange-500/10'
                    : 'bg-gray-800/50 border-gray-700/60 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 font-black flex items-center justify-center text-sm border border-orange-500/30">
                  e
                </div>
                <div>
                  <div className="text-xs font-bold text-white">e-Mola</div>
                  <div className="text-[10px] text-gray-400">Movitel (86/87)</div>
                </div>
                {selectedMethod === 'emola' && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-400" />
                )}
              </button>

              {/* MotoSaldo Wallet */}
              <button
                type="button"
                onClick={() => onSelectMethod('wallet')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 relative ${
                  selectedMethod === 'wallet'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-gray-800/50 border-gray-700/60 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">MotoSaldo</div>
                  <div className="text-[10px] text-emerald-400">Carteira da App</div>
                </div>
                {selectedMethod === 'wallet' && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>

              {/* Dinheiro (Cash) */}
              <button
                type="button"
                onClick={() => onSelectMethod('cash')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 relative ${
                  selectedMethod === 'cash'
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-gray-800/50 border-gray-700/60 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center border border-amber-500/30">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Dinheiro</div>
                  <div className="text-[10px] text-gray-400">Pagar em mão</div>
                </div>
                {selectedMethod === 'cash' && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            </div>

            {/* Mobile Number Input for M-Pesa / e-Mola */}
            {(selectedMethod === 'mpesa' || selectedMethod === 'emola') && (
              <div className="space-y-2 pt-2 animate-in fade-in">
                <label className="text-xs font-medium text-gray-300 flex items-center justify-between">
                  <span>Número de Celular ({selectedMethod === 'mpesa' ? 'Vodacom 84/85' : 'Movitel 86/87'})</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">+258 Moçambique</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-sm">
                    +258
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="84 123 4567"
                    className="w-full pl-16 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-500" />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleInitiatePayment}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Confirmar Pagamento</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step: USSD Push Sending */}
        {step === 'push_sent' && (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center relative">
              <Smartphone className="w-8 h-8 animate-bounce" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-75" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">A Enviar Notificação USSD Push...</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                Enviando solicitação de débito de <strong className="text-emerald-400">{amountMT.toFixed(2)} MT</strong> para o celular +258 {phoneNumber}.
              </p>
            </div>
            <div className="flex justify-center items-center gap-2 text-xs text-emerald-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Aguardando resposta da rede Vodacom/Movitel...</span>
            </div>
          </div>
        )}

        {/* Step: Enter USSD PIN Prompt */}
        {step === 'enter_pin' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <Lock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-extrabold text-white">Confirmar no Celular +258 {phoneNumber}</h4>
              <p className="text-xs text-gray-300 mt-1">
                Digite o seu PIN de segurança do {selectedMethod.toUpperCase()} para autorizar a transação de {amountMT.toFixed(2)} MT.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-center">
                PIN de 4 dígitos:
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • •"
                className="w-40 mx-auto block text-center tracking-[1em] text-xl font-black py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 text-xs text-center">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleConfirmPin}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A processar transação...</span>
                </>
              ) : (
                <span>Confirmar PIN e Autorizar</span>
              )}
            </button>
          </div>
        )}

        {/* Step: Success Confirmation */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-3 animate-in zoom-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-white">Pagamento Confirmado!</h4>
            <p className="text-xs text-emerald-400 font-semibold">
              {amountMT.toFixed(2)} MT recebidos com sucesso via {selectedMethod.toUpperCase()}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
