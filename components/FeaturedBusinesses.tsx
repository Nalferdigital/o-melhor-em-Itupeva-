
import React from 'react';
import { Business } from '../types';
import { Star, ArrowLeft, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturedBusinessesProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
  onOpenRegisterBusiness: () => void;
  onBack: () => void;
}

const FeaturedBusinesses: React.FC<FeaturedBusinessesProps> = ({ businesses, onSelectBusiness, onOpenRegisterBusiness, onBack }) => {
  const featured = businesses.filter(b => b.isFeatured && b.status === 'APPROVED');

  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3"
        >
          <Award className="text-yellow-500" size={32} />
          Empresas em Destaque
        </motion.h2>
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>
      
      <p className="text-gray-600 text-lg leading-relaxed">Conheça as empresas que são referência em qualidade e atendimento em Itupeva.</p>

      {featured.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center space-y-4"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Star size={32} />
          </div>
          <p className="text-gray-500 font-medium">Nenhuma empresa em destaque no momento.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((biz, i) => (
            <motion.div 
              key={biz.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelectBusiness(biz.id)}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative h-56">
                <img 
                  src={biz.imageUrl} 
                  alt={biz.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1">
                  <Star size={12} className="fill-yellow-900" />
                  Destaque
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-2xl text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{biz.name}</h3>
                    {(biz.plan === 'PRATA' || biz.plan === 'OURO') && (
                      <ShieldCheck size={20} className="text-blue-500" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="ml-1.5 text-sm font-black text-gray-800">{biz.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-black bg-blue-50 px-2.5 py-1 rounded-lg inline-block mb-4 uppercase tracking-wider">{biz.category}</p>
                <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">{biz.description}</p>
                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <span>📍 {biz.address.split('-')[0]}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-[2.5rem] text-white mt-12 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 space-y-4">
          <h4 className="font-black text-3xl tracking-tight">Quer sua empresa aqui?</h4>
          <p className="text-yellow-50 max-w-md text-lg leading-relaxed">Aumente sua visibilidade e alcance mais clientes com nosso plano de destaque exclusivo.</p>
          <button 
            onClick={onOpenRegisterBusiness}
            className="bg-white text-orange-600 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-yellow-50 transition-all shadow-xl active:scale-95"
          >
            Saber Mais
          </button>
        </div>
        <div className="absolute right-[-5%] bottom-[-10%] opacity-10 text-[12rem] select-none transform -rotate-12">
          <TrendingUp />
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedBusinesses;
