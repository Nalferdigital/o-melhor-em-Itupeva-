
import React, { useState } from 'react';
import { Business, Review } from '../types';

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

  const handleShare = () => {
    const text = `Confira a empresa ${business.name} em Itupeva no app O Melhor em Itupeva! 🚀`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
  };

  const openMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + " " + business.address)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen pb-12">
      <div className="relative h-64 md:h-96">
        <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-gray-800">
          ←
        </button>
        <button onClick={onToggleFavorite} className={`absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="px-6 py-8 space-y-6 -mt-8 relative bg-white rounded-t-[32px] shadow-2xl">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-gray-900">{business.name}</h2>
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-bold text-yellow-700">{business.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full inline-block">{business.category}</p>
          <p className="text-gray-500 text-sm flex items-center">
            <span className="mr-1">📍</span> {business.address}
          </p>
        </div>

        {business.promotions && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-start space-x-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-bold text-orange-800 text-sm uppercase">Oferta Especial</p>
              <p className="text-orange-700 font-medium">{business.promotions}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => window.open(`https://wa.me/${business.whatsapp}`, '_blank')}
            className="flex items-center justify-center space-x-2 bg-green-500 text-white p-4 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
          >
            <span>Falar no WhatsApp</span>
          </button>
          <button 
            onClick={openMaps}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <span>Ver Localização</span>
          </button>
        </div>

        <div className="flex justify-around border-y border-gray-100 py-4">
          <button onClick={handleShare} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <span className="text-xl">🔗</span>
            <span className="text-xs mt-1">Compartilhar</span>
          </button>
          {business.instagram && (
            <button onClick={() => window.open(`https://instagram.com/${business.instagram}`, '_blank')} className="flex flex-col items-center text-gray-600 hover:text-pink-600">
              <span className="text-xl">📸</span>
              <span className="text-xs mt-1">Instagram</span>
            </button>
          )}
          {business.website && (
            <button onClick={() => window.open(business.website, '_blank')} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <span className="text-xl">🌐</span>
              <span className="text-xs mt-1">Website</span>
            </button>
          )}
        </div>

        <section className="space-y-3">
          <h3 className="text-xl font-bold">Sobre a Empresa</h3>
          <p className="text-gray-600 leading-relaxed">{business.description}</p>
        </section>

        {/* Reviews Section */}
        <section className="space-y-6 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Avaliações ({reviews.length})</h3>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-gray-800">Deixe sua avaliação</h4>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setUserRating(star)} className="text-2xl">
                  {star <= userRating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-4 rounded-2xl border-gray-200 border bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Como foi sua experiência?"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button 
              onClick={() => {
                onSubmitReview(userRating, comment);
                setComment('');
              }}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              Publicar Avaliação
            </button>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400 italic">Ainda não há avaliações. Seja o primeiro!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-gray-800">{review.userName}</span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex text-xs text-yellow-400 mb-2">
                    {Array.from({ length: review.rating }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BusinessDetails;
