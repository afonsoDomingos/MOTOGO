import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ShieldCheck, X, CheckCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Preset quick accounts requested by user
  const handleQuickLogin = async (preEmail: string, prePass: string) => {
    setEmail(preEmail);
    setPassword(prePass);
    setLoading(true);
    setErrorMsg('');
    const user = await loginUser(preEmail, prePass);
    setLoading(false);
    if (user) {
      setSuccessMsg(`Bem-vindo, ${user.name}! (${user.role.toUpperCase()})`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } else {
      setErrorMsg('Credenciais inválidas.');
    }
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const user = await loginUser(email, password);
    setLoading(false);
    if (user) {
      setSuccessMsg(`Autenticado com sucesso como ${user.name}!`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } else {
      setErrorMsg('E-mail ou senha incorretos.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/MOTO GO LOGOTIPO.png" alt="MOTO GO" className="h-9 w-auto" />
            <h3 className="text-base font-black text-gray-900">Acesso MOTO GO</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-gray-100 text-gray-400 hover:text-gray-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Accounts Bar (Requested by user) */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="text-[11px] font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Contas de Acesso Rápido:</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => handleQuickLogin('cliente@motogo.com', '@Cliente123@')}
              className="p-2 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 text-left transition-all shadow-xs"
            >
              <div className="font-extrabold text-gray-900">🙋‍♂️ Cliente</div>
              <div className="text-gray-500 truncate">cliente@motogo.com</div>
              <div className="text-emerald-700 font-bold">@Cliente123@</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('motorista@motogo.com', '@Motorista123@')}
              className="p-2 rounded-xl bg-white border border-gray-200 hover:border-amber-500 text-left transition-all shadow-xs"
            >
              <div className="font-extrabold text-gray-900">🏍️ Motorista</div>
              <div className="text-gray-500 truncate">motorista@motogo.com</div>
              <div className="text-amber-700 font-bold">@Motorista123@</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@motogo.com', '@Admin123@')}
              className="p-2 rounded-xl bg-white border border-gray-200 hover:border-blue-500 text-left transition-all shadow-xs"
            >
              <div className="font-extrabold text-gray-900">🛡️ Admin Web</div>
              <div className="text-gray-500 truncate">admin@motogo.com</div>
              <div className="text-blue-700 font-bold">@Admin123@</div>
            </button>
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmitLogin} className="space-y-3 pt-1">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">E-mail</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@motogo.com"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                required
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Senha de Acesso</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                required
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black text-center flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Entrando...' : 'Entrar na Plataforma MOTO GO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
