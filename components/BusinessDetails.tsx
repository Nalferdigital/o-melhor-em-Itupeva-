
import React, { useState } from 'react';
import { Business, Review } from '../types';
import { ArrowLeft, Heart, Star, MapPin, Share2, Instagram, Globe, MessageCircle, Flame, Send, ShieldCheck, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

interface BusinessDetailsProps {
  business: Business;
  reviews: Review[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onSubmitReview: (rating: number, comment: string) => void;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({
  business,
  reviews,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSubmitReview
}) => {
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeImage, setActiveImage] = useState(business.imageUrl);

  const handleShare = () => {
    const text = `Confira a empresa ${business.name} em Itupeva no app O Melhor em Itupeva! 🚀`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
  };

  const openMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + " " + business.address)}`, '_blank');
  };

  const isVerified = business.plan === 'PRATA' || business.plan === 'OURO';

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen pb-12">
      <div className="relative h-64 md:h-96 overflow-hidden">
        <motion.img 
          key={activeImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src={activeImage} 
          alt={business.name} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl text-gray-800 z-10"
        >
          <ArrowLeft size={24} />
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleFavorite} 
          className={`absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl z-10 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
        >
          <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
        </motion.button>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 py-8 space-y-8 -mt-12 relative bg-white rounded-t-[3rem] shadow-2xl"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">{business.name}</h2>
                {isVerified && (
                  <div className="text-blue-500 bg-blue-50 p-1 rounded-full shadow-sm" title="Empresa Verificada">
                    <ShieldCheck size={24} fill="currentColor" className="text-white" />
                  </div>
                )}
              </div>
              <p className="text-gray-500 font-medium flex items-center gap-2 text-sm">
                <MapPin size={18} className="text-blue-500" /> {business.address}
              </p>
            </div>
            <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100 shadow-sm">
              <Star className="text-yellow-500 fill-yellow-500 mr-1.5" size={20} />
              <span className="font-black text-yellow-700 text-lg">{business.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <p className="text-blue-600 font-black bg-blue-50 px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider">{business.category}</p>
            {business.isFeatured && (
              <p className="text-yellow-700 font-black bg-yellow-100 px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1">
                <Star size={12} className="fill-yellow-700" /> Destaque
              </p>
            )}
            {isVerified && (
              <p className="text-blue-700 font-black bg-blue-100 px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} /> Verificada
              </p>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {business.gallery && business.gallery.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase tracking-widest text-xs">Galeria de Fotos</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              <button 
                onClick={() => setActiveImage(business.imageUrl)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === business.imageUrl ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-70'}`}
              >
                <img src={business.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
              {business.gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-70'}`}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </section>
        )}

        {business.promotions && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 p-6 rounded-[2rem] flex items-start gap-4 shadow-sm"
          >
            <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg">
              <Flame size={24} />
            </div>
            <div>
              <p className="font-black text-orange-800 text-xs uppercase tracking-widest mb-1">Oferta Especial</p>
              <p className="text-orange-900 font-bold text-lg leading-tight">{business.promotions}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open(`https://wa.me/${business.whatsapp}`, '_blank')}
            className="flex items-center justify-center gap-3 bg-green-500 text-white p-5 rounded-2xl font-black text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-200"
          >
            <MessageCircle size={24} />
            <span>WhatsApp</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openMaps}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
          >
            <MapPin size={24} />
            <span>Localização</span>
          </motion.button>
        </div>

        <div className="flex justify-around border-y border-gray-100 py-6">
          <button onClick={handleShare} className="flex flex-col items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors group">
            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
              <Share2 size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Compartilhar</span>
          </button>
          {business.instagram && (
            <button onClick={() => window.open(`https://instagram.com/${business.instagram}`, '_blank')} className="flex flex-col items-center gap-2 text-gray-400 hover:text-pink-600 transition-colors group">
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-pink-50 transition-colors">
                <Instagram size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
            </button>
          )}
          {business.website && (
            <button onClick={() => window.open(business.website, '_blank')} className="flex flex-col items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors group">
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                <Globe size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Website</span>
            </button>
          )}
        </div>

        <section className="space-y-4">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Sobre a Empresa</h3>
          <p className="text-gray-600 leading-relaxed text-lg">{business.description}</p>
        </section>

        {/* Reviews Section */}
        <section className="space-y-8 pt-8 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Avaliações ({reviews.length})</h3>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-6 shadow-inner border border-gray-100">
            <h4 className="font-black text-gray-800 uppercase tracking-widest text-xs">Deixe sua avaliação</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setUserRating(star)} 
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={32} 
                    className={star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                  />
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-5 rounded-3xl border-none bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-lg"
              placeholder="Como foi sua experiência?"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSubmitReview(userRating, comment);
                setComment('');
              }}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Publicar Avaliação
            </motion.button>
          </div>

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold italic">Ainda não há avaliações. Seja o primeiro!</p>
              </div>
            ) : (
              reviews.map((review, i) => (
                <motion.div 
                  key={review.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-gray-900 text-lg">{review.userName}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.date}</span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default BusinessDetails;
