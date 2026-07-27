import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PaymentMethod } from '../types';
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, X, Smartphone, CheckCircle, History } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { motoSaldo, transactions, topupWallet } = useApp();
  const [amount, setAmount] = useState<number>(200);
  const [method, setMethod] = useState<PaymentMethod>('mpesa');
  const [phone, setPhone] = useState('841234567');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const success = await topupWallet(amount, method, phone);
    setLoading(false);
    if (success) {
      setSuccessMsg(`Recarga de ${amount} MT efetuada com sucesso via ${method.toUpperCase()}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Carteira MotoSaldo</h3>
              <p className="text-xs text-gray-400">Gerencie seu saldo em Meticais (MT)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-6 pt-4 pr-1">
          {/* Main Balance Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-800 via-gray-800/90 to-emerald-950/40 border border-emerald-500/30 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-6xl text-emerald-400 pointer-events-none">
              MT
            </div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Saldo Disponível</div>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              {motoSaldo.toFixed(2).replace('.', ',')} <span className="text-emerald-400 text-xl font-bold">MT</span>
            </div>
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <span>✓ Pronto para corridas Moto Táxi & Moto Food</span>
            </p>
          </div>

          {/* Quick Topup Form */}
          <div className="p-4 rounded-2xl bg-gray-800/40 border border-gray-700/60 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Recarregar MotoSaldo</span>
            </div>

            <form onSubmit={handleTopup} className="space-y-4">
              {/* Preset Amounts */}
              <div>
                <label className="text-[11px] text-gray-400 block mb-2 font-medium">Selecione o valor (MT):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        amount === val
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      {val} MT
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Provider Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('mpesa')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    method === 'mpesa'
                      ? 'bg-red-950/40 border-red-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-red-600/20 text-red-500 font-extrabold flex items-center justify-center text-[10px]">
                    M
                  </div>
                  <span>M-Pesa (Vodacom)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('emola')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    method === 'emola'
                      ? 'bg-orange-950/40 border-orange-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-extrabold flex items-center justify-center text-[10px]">
                    e
                  </div>
                  <span>e-Mola (Movitel)</span>
                </button>
              </div>

              {/* Phone Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-xs font-bold">
                  +258
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="84 123 4567"
                  className="w-full pl-14 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                />
                <Smartphone className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
              </div>

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'A processar USSD Push...' : `Recarregar ${amount} MT via ${method.toUpperCase()}`}
              </button>
            </form>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Histórico de Transações</span>
            </div>

            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-gray-800/60 border border-gray-700/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                        tx.type === 'topup'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {tx.type === 'topup' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{tx.description}</div>
                      <div className="text-[10px] text-gray-400">
                        {tx.timestamp} • Ref: {tx.reference || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`text-xs font-extrabold ${
                      tx.type === 'topup' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {tx.type === 'topup' ? '+' : '-'}{tx.amountMT.toFixed(2)} MT
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
