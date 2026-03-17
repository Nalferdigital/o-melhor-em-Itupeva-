
import React from 'react';
import { Business } from '../types';
import { ArrowLeft, CheckCircle2, XCircle, Star, ShieldCheck, Clock, Building2, Trash2, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPanelProps {
  businesses: Business[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onEdit: (biz: Business) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ businesses, onApprove, onReject, onToggleFeatured, onEdit, onBack }) => {
  const pending = businesses.filter(b => b.status === 'PENDING');
  const approved = businesses.filter(b => b.status === 'APPROVED');

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 pb-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Painel Administrativo</h2>
            <p className="text-gray-500 font-medium text-sm">Gerencie as empresas de Itupeva</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ x: -5 }}
          onClick={onBack} 
          className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs bg-blue-50 px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={16} />
          Voltar
        </motion.button>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 text-orange-600">
          <Clock size={20} />
          <h3 className="text-xl font-black uppercase tracking-widest">Aguardando Aprovação ({pending.length})</h3>
        </div>
        
        {pending.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 font-bold italic bg-gray-50 p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center"
          >
            Nenhuma pendência no momento.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pending.map((b, i) => (
              <motion.div 
                key={b.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={b.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg leading-tight">{b.name}</h4>
                    <p className="text-sm text-gray-500 font-bold">{b.category} • {b.ownerName}</p>
                    <p className="text-xs text-gray-400 mt-1">{b.address}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(b)} 
                    className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all"
                    title="Editar Empresa"
                  >
                    <Building2 size={20} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(`https://wa.me/${b.whatsapp}`, '_blank')} 
                    className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-all"
                    title="Enviar WhatsApp"
                  >
                    <MessageCircle size={20} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = `mailto:${b.email}`} 
                    className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"
                    title="Enviar E-mail"
                  >
                    <Mail size={20} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onApprove(b.id)} 
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                  >
                    <CheckCircle2 size={18} />
                    Aprovar
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReject(b.id)} 
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-100 transition-all"
                  >
                    <XCircle size={18} />
                    Rejeitar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 text-gray-800">
          <Building2 size={20} />
          <h3 className="text-xl font-black uppercase tracking-widest">Empresas Publicadas ({approved.length})</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approved.map((b, i) => (
            <motion.div 
              key={b.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-5 rounded-3xl flex items-center justify-between border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <img src={b.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm leading-tight">{b.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{b.category}</p>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => onToggleFeatured(b.id)}
                      className={`text-[9px] font-black px-3 py-1 rounded-xl uppercase tracking-widest flex items-center gap-1 transition-all ${
                        b.isFeatured 
                          ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-100' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Star size={10} className={b.isFeatured ? 'fill-yellow-900' : ''} />
                      {b.isFeatured ? 'Destaque' : 'Destacar'}
                    </button>
                    <button 
                      onClick={() => onEdit(b)}
                      className="text-gray-400 hover:text-blue-600"
                      title="Editar"
                    >
                      <Building2 size={14} />
                    </button>
                    <button 
                      onClick={() => window.open(`https://wa.me/${b.whatsapp}`, '_blank')}
                      className="text-green-600 hover:text-green-700"
                      title="WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </button>
                    <button 
                      onClick={() => window.location.href = `mailto:${b.email}`}
                      className="text-blue-600 hover:text-blue-700"
                      title="E-mail"
                    >
                      <Mail size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, color: '#ef4444' }}
                onClick={() => onReject(b.id)} 
                className="p-2 text-gray-300 hover:bg-red-50 rounded-xl transition-all"
                title="Remover empresa"
              >
                <Trash2 size={18} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
