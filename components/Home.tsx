
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { Business } from '../types';

interface HomeProps {
  businesses: Business[];
  onSelectBusiness: (id: string) => void;
  onSelectCategory: (cat: string) => void;
  onSearch: (q: string) => void;
  onOpenRegisterUser: () => void;
  onOpenRegisterBusiness: () => void;
  onOpenAdmin: () => void;
}

const Home: React.FC<HomeProps> = ({
  businesses,
  onSelectBusiness,
  onSelectCategory,
  onSearch,
  onOpenRegisterUser,
  onOpenRegisterBusiness,
  onOpenAdmin
}) => {
  const [query, setQuery] = useState('');

  const featured = businesses.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Hero / Search */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          Tudo o que você precisa <br/> em <span className="text-blue-600">Itupeva-SP</span>
        </h2>
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Nome da empresa ou categoria..."
            className="w-full px-5 py-4 pl-12 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-blue-500 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale brightness-0 opacity-50">🔎</span>
          <button 
            onClick={() => onSearch(query)}
            className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </section>

      {/* Main Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onClick={() => onSearch('')} className="flex flex-col items-center p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-all">
          <span className="text-2xl mb-2">🔎</span>
          <span className="text-xs font-bold uppercase tracking-wider">Empresas</span>
        </button>
        <button onClick={onOpenRegisterUser} className="flex flex-col items-center p-4 bg-green-50 text-green-700 rounded-2xl hover:bg-green-100 transition-all">
          <span className="text-2xl mb-2">👤</span>
          <span className="text-xs font-bold uppercase tracking-wider">Usuário</span>
        </button>
        <button onClick={onOpenRegisterBusiness} className="flex flex-col items-center p-4 bg-orange-50 text-orange-700 rounded-2xl hover:bg-orange-100 transition-all">
          <span className="text-2xl mb-2">🏢</span>
          <span className="text-xs font-bold uppercase tracking-wider">Empresário</span>
        </button>
        <button onClick={onOpenAdmin} className="flex flex-col items-center p-4 bg-purple-50 text-purple-700 rounded-2xl hover:bg-purple-100 transition-all">
          <span className="text-2xl mb-2">⭐</span>
          <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
        </button>
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold">Empresas por Categoria</h3>
          <button className="text-blue-600 text-sm font-semibold">Ver todas</button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat.name)}
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all"
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-[10px] font-medium text-gray-600 truncate w-full text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Businesses */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold">Destaques em Itupeva</h3>
          <button className="text-blue-600 text-sm font-semibold">Mais populares</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map(biz => (
            <div 
              key={biz.id} 
              onClick={() => onSelectBusiness(biz.id)}
              className="flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-1/3 overflow-hidden">
                <img src={biz.imageUrl} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg leading-tight mb-1">{biz.name}</h4>
                  <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-2">{biz.category}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{biz.description}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center text-sm font-bold text-gray-900">
                    <span className="text-yellow-400 mr-1">★</span> {biz.rating.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Ver mais →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Callouts */}
      <section className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <h3 className="text-2xl font-bold">Seja um anunciante!</h3>
          <p className="text-blue-100 max-w-sm">Conecte sua empresa com milhares de moradores e turistas em Itupeva.</p>
          <button 
            onClick={onOpenRegisterBusiness}
            className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors"
          >
            Começar agora
          </button>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 flex items-center justify-center opacity-20 text-9xl select-none">🏢</div>
      </section>
    </div>
  );
};

export default Home;
