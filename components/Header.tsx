
import React from 'react';
import { Home, Star, Map, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onHome: () => void;
  onFeatured: () => void;
  onTurismo: () => void;
  onEventos: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, onFeatured, onTurismo, onEventos }) => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={onHome}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm">I</div>
          <div className="hidden sm:block">
            <h1 className="text-blue-600 font-black text-2xl leading-tight tracking-tighter">O Melhor em</h1>
            <h2 className="text-gray-900 font-bold text-xs leading-tight uppercase tracking-[0.3em]">Itupeva</h2>
          </div>
        </motion.div>
        
        <div className="hidden md:flex space-x-6">
          <button onClick={onHome} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <Home size={18} />
            <span>Início</span>
          </button>
          <button onClick={onFeatured} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
            <span>Destaque</span>
          </button>
          <button onClick={onTurismo} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <Map size={18} />
            <span>Turismo</span>
          </button>
          <button onClick={onEventos} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <Calendar size={18} />
            <span>Eventos</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
