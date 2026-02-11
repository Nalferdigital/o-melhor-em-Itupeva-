
import React from 'react';

interface HeaderProps {
  onHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome }) => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onHome}>
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">I</div>
          <div>
            <h1 className="text-blue-600 font-bold text-lg leading-tight">O Melhor em</h1>
            <h2 className="text-gray-800 font-semibold text-sm leading-tight">Itupeva</h2>
          </div>
        </div>
        <div className="hidden md:flex space-x-6">
          <button onClick={onHome} className="text-gray-600 hover:text-blue-600 font-medium">Início</button>
          <button className="text-gray-600 hover:text-blue-600 font-medium">Turismo</button>
          <button className="text-gray-600 hover:text-blue-600 font-medium">Eventos</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
