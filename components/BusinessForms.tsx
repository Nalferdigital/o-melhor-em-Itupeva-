
import React, { useState, useRef } from 'react';
import { Business } from '../types';
import { CATEGORIES } from '../constants';
import { ArrowLeft, Camera, Info, Link as LinkIcon, Upload, Trash2, FileWarning, Star, Crown, Zap, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BusinessFormsProps {
  onSubmit: (biz: Business) => void;
  onBack: () => void;
  initialData?: Business;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit for localStorage safety

const BusinessForms: React.FC<BusinessFormsProps> = ({ onSubmit, onBack, initialData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    ownerName: initialData?.ownerName || '',
    cnpj: initialData?.cnpj || '',
    phone: initialData?.phone || '',
    whatsapp: initialData?.whatsapp || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    category: initialData?.category || CATEGORIES[0].name,
    description: initialData?.description || '',
    instagram: initialData?.instagram || '',
    facebook: initialData?.facebook || '',
    website: initialData?.website || '',
    promotions: initialData?.promotions || '',
    imageUrl: initialData?.imageUrl || '',
    plan: initialData?.plan || 'BRONZE',
    gallery: initialData?.gallery || [] as string[]
  });

  const [fileError, setFileError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB). O limite é 1MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
        setFileInfo({ 
          name: file.name, 
          size: (file.size / 1024).toFixed(1) + ' KB' 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("Arquivo muito grande. Limite de 1MB.");
        return;
      }
      
      const maxPhotos = formData.plan === 'PRATA' ? 3 : (formData.plan === 'OURO' ? 10 : 0);
      if (formData.gallery.length >= maxPhotos) {
        alert(`Seu plano permite no máximo ${maxPhotos} fotos na galeria.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, gallery: [...formData.gallery, reader.result as string] });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (idx: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== idx) });
  };

  const clearImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    setFileInfo(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const biz: Business = {
      ...formData,
      id: initialData?.id || Date.now().toString(),
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.name}/800/600`,
      rating: initialData?.rating || 0,
      status: initialData?.status || 'PENDING',
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
    };
    onSubmit(biz);
  };

  const plans = [
    { id: 'BRONZE', name: 'Bronze', icon: <Zap size={16} />, color: 'orange' },
    { id: 'PRATA', name: 'Prata', icon: <Star size={16} />, color: 'blue' },
    { id: 'OURO', name: 'Ouro', icon: <Crown size={16} />, color: 'yellow' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <motion.button 
        whileHover={{ x: -5 }}
        onClick={onBack} 
        className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs bg-blue-50 px-4 py-2 rounded-xl"
      >
        <ArrowLeft size={16} />
        Voltar
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg">I</div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {initialData ? 'Editar Empresa' : 'Cadastrar minha Empresa'}
          </h2>
          <p className="text-gray-500 font-medium">
            {initialData 
              ? 'Atualize as informações da sua empresa abaixo.' 
              : 'Preencha os dados abaixo. Nosso time irá revisar as informações antes da publicação.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Plan Selection */}
          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Crown size={14} /> Plano Selecionado
            </label>
            <div className="grid grid-cols-3 gap-4">
              {plans.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({...formData, plan: p.id as any})}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                    formData.plan === p.id 
                      ? `border-${p.color}-500 bg-${p.color}-50 text-${p.color}-700 shadow-md` 
                      : 'border-gray-100 bg-gray-50 text-gray-400 grayscale'
                  }`}
                >
                  <div className="mb-2">{p.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Camera size={14} /> Foto Principal
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-video md:aspect-square rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group
                  ${formData.imageUrl ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30'}`}
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                        <Upload size={24} />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearImage(); }}
                        className="bg-red-500 p-3 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-gray-400 group-hover:text-blue-500 transition-colors">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-700">Clique para enviar</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PNG, JPG até 1MB</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* URL and Info Box */}
              <div className="space-y-4 flex flex-col justify-center">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ou use um link externo</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <LinkIcon size={18} />
                    </div>
                    <input 
                      placeholder="https://..." 
                      className="w-full p-5 pl-12 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-medium text-sm" 
                      value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl} 
                      onChange={e => {
                        setFormData({...formData, imageUrl: e.target.value});
                        setFileInfo(null);
                      }} 
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {fileInfo && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 p-4 rounded-2xl flex items-center justify-between border border-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                          <Info size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-green-800 uppercase truncate max-w-[150px]">{fileInfo.name}</p>
                          <p className="text-[10px] font-bold text-green-600 uppercase">Tamanho: {fileInfo.size}</p>
                        </div>
                      </div>
                      <button onClick={clearImage} className="text-green-700 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  )}

                  {fileError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 p-4 rounded-2xl flex items-start gap-3 border border-red-100"
                    >
                      <FileWarning size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-red-700 font-bold leading-relaxed">
                        {fileError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          {formData.plan !== 'BRONZE' && (
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Camera size={14} /> Galeria de Fotos ({formData.gallery.length}/{formData.plan === 'PRATA' ? 3 : 10})
              </label>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {formData.gallery.map((img, idx) => (
                  <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden group">
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(formData.plan === 'OURO' || formData.gallery.length < 3) && (
                  <button 
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex-shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all"
                  >
                    <Plus size={24} />
                    <input type="file" ref={galleryInputRef} onChange={handleGalleryChange} accept="image/*" className="hidden" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-5 rounded-[2rem] flex items-start gap-4">
            <div className="bg-blue-600 p-2 rounded-xl text-white flex-shrink-0">
              <Info size={16} />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-blue-900 font-black uppercase tracking-wider">Dica de Imagem</p>
              <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                Imagens quadradas (1:1) ou paisagem (4:3) funcionam melhor. O sistema aceita arquivos de até 1MB para garantir o carregamento rápido.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome da Empresa</label>
              <input required className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Responsável</label>
              <input required className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-medium" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">WhatsApp</label>
              <input required className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-medium" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Categoria</label>
              <div className="relative">
                <select className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-bold text-gray-700 appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Info size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Endereço Completo</label>
            <input required className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-medium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Descrição da Empresa</label>
            <textarea required className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-medium" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Redes Sociais & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder="Instagram (ex: @suaempresa)" className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-medium" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
              <input placeholder="Site (ex: https://...)" className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none shadow-inner font-medium" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-orange-500 uppercase tracking-widest">Promoções ou Ofertas</label>
            <input placeholder="Ex: 20% de desconto na primeira compra" className="w-full p-5 bg-orange-50 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none border-none shadow-inner font-bold text-orange-900 placeholder-orange-300" value={formData.promotions} onChange={e => setFormData({...formData, promotions: e.target.value})} />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            {initialData ? 'Salvar Alterações' : 'Enviar Cadastro para Aprovação'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default BusinessForms;
