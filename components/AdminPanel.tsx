
import React from 'react';
import { Business } from '../types';

interface AdminPanelProps {
  businesses: Business[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ businesses, onApprove, onReject, onBack }) => {
  const pending = businesses.filter(b => b.status === 'PENDING');
  const approved = businesses.filter(b => b.status === 'APPROVED');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Painel Administrativo</h2>
        <button onClick={onBack} className="text-blue-600 font-medium">Voltar</button>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-orange-600">Aguardando Aprovação ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="text-gray-400 italic bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">Nenhuma pendência no momento.</p>
        ) : (
          <div className="space-y-4">
            {pending.map(b => (
              <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-lg">{b.name}</h4>
                  <p className="text-sm text-gray-500">{b.category} • {b.ownerName}</p>
                  <p className="text-xs text-gray-400 mt-1">{b.address}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => onApprove(b.id)} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors">Aprovar</button>
                  <button onClick={() => onReject(b.id)} className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors">Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Empresas Publicadas ({approved.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approved.map(b => (
            <div key={b.id} className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                  <img src={b.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{b.name}</h4>
                  <p className="text-[10px] text-gray-500">{b.category}</p>
                </div>
              </div>
              <button onClick={() => onReject(b.id)} className="text-xs text-red-400 font-bold uppercase tracking-wider">Remover</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
