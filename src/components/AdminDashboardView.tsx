import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_DRIVERS } from '../data/mockData';
import { ShieldCheck, Users, Bike, DollarSign, Activity, Settings, Search, ArrowUpRight } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { rideHistory, transactions, isMongoConnected } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'pricing' | 'transactions'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate live admin stats
  const totalRevenueMT = transactions
    .filter((t) => t.type === 'topup' || t.type === 'payment')
    .reduce((acc, t) => acc + t.amountMT, 0) + 158450;

  const totalRidesCount = rideHistory.length + 1280;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner Admin */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-900">Painel Administrativo Web</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 text-[10px] font-black uppercase">
                ADMIN MOTO GO
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Gestão centralizada de passageiros, motoristas, entregas e pagamentos em Moçambique 🇲🇿
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isMongoConnected && (
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm">
              <span>🍃 MongoDB Atlas (motogodb)</span>
            </span>
          )}
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Receita Movimentada</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {totalRevenueMT.toFixed(2).replace('.', ',')} MT
          </div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>M-Pesa & e-Mola Moçambique</span>
          </p>
        </div>

        {/* Total Rides */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total de Corridas</span>
            <Activity className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalRidesCount}</div>
          <p className="text-[10px] text-gray-500 font-semibold">Moto Táxi & Entregas</p>
        </div>

        {/* Active Drivers */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Motoristas Ativos</span>
            <Bike className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">28 no terreno</div>
          <p className="text-[10px] text-emerald-700 font-bold">Maputo & Matola</p>
        </div>

        {/* Registered Users */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-md space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Clientes Registados</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">452 usuários</div>
          <p className="text-[10px] text-gray-500 font-semibold">Contas ativas</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Visão Geral & Corridas
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'drivers'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Motoristas MOTO GO
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pricing'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Tabela de Tarifas MT
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'transactions'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Relatório M-Pesa / e-Mola
        </button>
      </div>

      {/* Tab: Overview (Real-Time Rides Table) */}
      {activeTab === 'overview' && (
        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-base font-black text-gray-900">Monitor de Corridas em Tempo Real</h3>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID, local ou motorista..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-amber-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">ID Corrida</th>
                  <th className="py-3 px-3">Serviço</th>
                  <th className="py-3 px-3">Origem ➔ Destino</th>
                  <th className="py-3 px-3">Valor MT</th>
                  <th className="py-3 px-3">Pagamento</th>
                  <th className="py-3 px-3">Motorista</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rideHistory.map((ride) => (
                  <tr key={ride.id} className="hover:bg-gray-50 transition-colors font-medium">
                    <td className="py-3 px-3 font-extrabold text-gray-900">{ride.id}</td>
                    <td className="py-3 px-3 uppercase font-bold text-amber-600">{ride.service}</td>
                    <td className="py-3 px-3 text-gray-600 max-w-xs truncate">
                      {ride.origin.name} ➔ {ride.destination.name}
                    </td>
                    <td className="py-3 px-3 font-black text-emerald-600">
                      {ride.totalMT.toFixed(2).replace('.', ',')} MT
                    </td>
                    <td className="py-3 px-3 uppercase font-bold text-gray-700">{ride.paymentMethod}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">{ride.driver?.name || 'Manuel Ernesto'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-extrabold text-[10px]">
                        Concluída
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Drivers Management */}
      {activeTab === 'drivers' && (
        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4">
          <h3 className="text-base font-black text-gray-900">Gestão de Motoristas Cadastrados</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_DRIVERS.map((drv) => (
              <div key={drv.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={drv.photo}
                    alt={drv.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h4 className="text-xs font-black text-gray-900">{drv.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold">{drv.phone}</p>
                    <span className="text-[10px] text-amber-600 font-extrabold">⭐ {drv.rating} • {drv.totalRides} corridas</span>
                  </div>
                </div>

                <div className="text-xs border-t border-gray-200 pt-2 space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Motocicleta:</span>
                    <strong className="text-gray-900">{drv.motorbike}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Matrícula:</span>
                    <strong className="text-gray-900">{drv.plate}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-extrabold shadow-sm">
                    Ativo
                  </button>
                  <button className="flex-1 py-1.5 rounded-xl bg-gray-200 text-gray-700 text-[11px] font-bold">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Automatic Pricing Table Settings */}
      {activeTab === 'pricing' && (
        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-black text-gray-900">Tabela de Tarifas Automáticas (Distância / Tempo / Valor MT)</h3>
              <p className="text-xs text-gray-500 font-medium">Regras de precificação configuradas para Moçambique</p>
            </div>
            <Settings className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { dist: 'Até 2 km', min: '5 min', price: '50,00 MT' },
              { dist: '3 km', min: '7 min', price: '60,00 MT' },
              { dist: '5 km', min: '10 min', price: '80,00 MT' },
              { dist: '8 km', min: '15 min', price: '110,00 MT' },
              { dist: '10 km', min: '20 min', price: '130,00 MT' },
              { dist: '15 km', min: '30 min', price: '180,00 MT' },
              { dist: '20 km+', min: '40 min', price: '230,00 MT' }
            ].map((rule, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-gray-900">{rule.dist}</span>
                  <span className="text-gray-500 ml-2 font-medium">⏱️ {rule.min}</span>
                </div>
                <span className="font-black text-emerald-600 text-sm">{rule.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: M-Pesa / e-Mola Financial Reports */}
      {activeTab === 'transactions' && (
        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-4">
          <h3 className="text-base font-black text-gray-900">Relatório Financeiro M-Pesa & e-Mola</h3>
          
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 font-black flex items-center justify-center uppercase">
                    {tx.method[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{tx.description}</div>
                    <div className="text-[10px] text-gray-500">{tx.timestamp} • Ref: {tx.reference}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-600">{tx.amountMT.toFixed(2).replace('.', ',')} MT</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">{tx.method}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
