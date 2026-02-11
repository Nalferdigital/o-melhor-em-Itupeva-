
import React, { useState } from 'react';
import { Business } from '../types';
import { CATEGORIES } from '../constants';

interface BusinessFormsProps {
  onSubmit: (biz: Business) => void;
  onBack: () => void;
}

const BusinessForms: React.FC<BusinessFormsProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    cnpj: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    category: CATEGORIES[0].name,
    description: '',
    instagram: '',
    facebook: '',
    website: '',
    promotions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBiz: Business = {
      ...formData,
      id: Date.now().toString(),
      imageUrl: 'https://picsum.photos/seed/business/800/600',
      rating: 0,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0]
    };
    onSubmit(newBiz);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <button onClick={onBack} className="text-blue-600 font-medium">← Voltar</button>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2">Cadastrar minha Empresa</h2>
        <p className="text-gray-500 mb-8 text-sm">Preencha os dados abaixo. Nosso time irá revisar as informações antes da publicação.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Nome da Empresa</label>
              <input required className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Responsável</label>
              <input required className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">WhatsApp (Apenas números)</label>
              <input required className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Categoria</label>
              <select className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Endereço Completo</label>
            <input required className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Descrição da Empresa</label>
            <textarea required className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-800 mb-4">Redes Sociais & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Instagram (usuário)" className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
              <input placeholder="Site (URL completa)" className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-orange-400 uppercase">Promoções ou Ofertas Atuais</label>
            <input placeholder="Ex: 20% de desconto na primeira compra" className="w-full p-4 bg-orange-50 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" value={formData.promotions} onChange={e => setFormData({...formData, promotions: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-colors">
            Enviar Cadastro para Aprovação
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessForms;
