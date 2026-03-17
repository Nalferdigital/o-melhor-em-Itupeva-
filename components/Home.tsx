
import React, { useState, useRef } from 'react';
import { CATEGORIES } from '../constants';
import { Business } from '../types';
import { Search, User as UserIcon, Building2, ShieldCheck, Star, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
  onSelectCategory: (cat: string) => void;
  onSearch: (q: string) => void;
  onOpenRegisterUser: () => void;
  onOpenRegisterBusiness: () => void;
  onOpenAdmin: () => void;
  onOpenFeatured: () => void;
}

const Home: React.FC<HomeProps> = ({
  businesses,
  onSelectBusiness,
  onSelectCategory,
  onSearch,
  onOpenRegisterUser,
  onOpenRegisterBusiness,
  onOpenAdmin,
  onOpenFeatured
}) => {
  const [query, setQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const featured = businesses.filter(b => b.isFeatured && b.status === 'APPROVED').slice(0, 12);
  const displayFeatured = featured.length > 0 ? featured : businesses.slice(0, 8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 overflow-x-hidden">
      {/* Hero / Search */}
      <section className="text-center space-y-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-4"
        >
          <img 
            src="https://storage.googleapis.com/aistudio-build-assets/itupeva-logo.png" 
            alt="O Melhor em Itupeva" 
            className="w-32 h-32 object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-gray-900 md:text-5xl tracking-tight"
        >
          Tudo o que você precisa <br/> em <span className="text-blue-600">Itupeva-SP</span>
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-lg mx-auto"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Nome da empresa ou categoria..."
            className="w-full px-5 py-4 pl-12 rounded-2xl border-none shadow-xl focus:ring-2 focus:ring-blue-500 text-lg bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
          />
          <button 
            onClick={() => onSearch(query)}
            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            Buscar
          </button>
        </motion.div>
      </section>

      {/* Main Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Search />, label: 'Explorar', color: 'blue', onClick: () => onSearch('') },
          { icon: <Building2 />, label: 'Anunciar', color: 'orange', onClick: onOpenRegisterBusiness },
          { icon: <UserIcon />, label: 'Minha Conta', color: 'green', onClick: onOpenRegisterUser },
          { icon: <ShieldCheck />, label: 'Admin', color: 'purple', onClick: onOpenAdmin },
        ].map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={action.onClick}
            className={`flex flex-col items-center p-5 bg-${action.color}-50 text-${action.color}-700 rounded-3xl hover:bg-${action.color}-100 transition-all shadow-sm border border-${action.color}-100`}
          >
            <div className="mb-3">{action.icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Categorias</h3>
          <button className="text-blue-600 text-sm font-bold hover:underline">Ver todas</button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.button 
              key={cat.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectCategory(cat.name)}
              className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center uppercase tracking-tighter">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured Businesses */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={24} />
            Destaques
          </h3>
          <button 
            onClick={onOpenFeatured}
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            Ver todos
          </button>
        </div>
        
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar snap-x snap-mandatory -mx-4 px-4"
          >
            {displayFeatured.map((biz, i) => (
              <motion.div 
                key={biz.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onSelectBusiness(biz.id)}
                className="flex-shrink-0 w-[85%] md:w-[450px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all group relative snap-center"
              >
                {biz.isFeatured && (
                  <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Destaque
                  </div>
                )}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={biz.imageUrl} 
                    alt={biz.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <h4 className="font-bold text-xl leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">{biz.name}</h4>
                      {(biz.plan === 'PRATA' || biz.plan === 'OURO') && (
                        <ShieldCheck size={16} className="text-blue-500" fill="currentColor" />
                      )}
                    </div>
                    <p className="text-[10px] text-blue-600 font-black bg-blue-50 px-2 py-1 rounded-lg inline-block mb-3 uppercase tracking-wider">{biz.category}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{biz.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm font-black text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                      <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" /> {biz.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center text-blue-600 text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      Ver mais <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-xl border border-gray-100 text-gray-600 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 hidden md:flex z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-xl border border-gray-100 text-gray-600 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 hidden md:flex z-20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Visual Hint for Scroll */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-full bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden" />
        </div>
      </section>

      {/* Strategic Callouts */}
      <motion.section 
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-black tracking-tight">Seja um anunciante!</h3>
          <p className="text-blue-100 max-w-sm text-lg leading-relaxed">Conecte sua empresa com milhares de moradores e turistas em Itupeva.</p>
          <button 
            onClick={onOpenRegisterBusiness}
            className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95"
          >
            Começar agora
          </button>
        </div>
        <div className="absolute right-[-5%] bottom-[-10%] opacity-10 text-[15rem] select-none transform rotate-12">
          <Building2 />
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
