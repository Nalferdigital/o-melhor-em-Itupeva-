
import React, { useState, useEffect, useMemo } from 'react';
import { User, Business, Review, Category, UserRole } from './types';
import { CATEGORIES, MOCK_BUSINESSES } from './constants';
import Home from './components/Home';
import BusinessDetails from './components/BusinessDetails';
import UserForms from './components/UserForms';
import BusinessForms from './components/BusinessForms';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';

const App: React.FC = () => {
  // Persistence state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'profile' | 'admin' | 'business-reg' | 'details'>('home');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedBusinesses = localStorage.getItem('itupeva_businesses');
    if (savedBusinesses) setBusinesses(JSON.parse(savedBusinesses));

    const savedUser = localStorage.getItem('itupeva_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedReviews = localStorage.getItem('itupeva_reviews');
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('itupeva_businesses', JSON.stringify(businesses));
    localStorage.setItem('itupeva_reviews', JSON.stringify(reviews));
  }, [businesses, reviews]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('itupeva_user', JSON.stringify(user));
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('itupeva_user');
    setActiveTab('home');
  };

  const addBusiness = (biz: Business) => {
    setBusinesses(prev => [...prev, biz]);
    setActiveTab('home');
    alert("Seu cadastro foi enviado para análise!");
  };

  const addReview = (review: Review) => {
    setReviews(prev => [...prev, review]);
  };

  const toggleFavorite = (bizId: string) => {
    setFavorites(prev => 
      prev.includes(bizId) ? prev.filter(id => id !== bizId) : [...prev, bizId]
    );
  };

  const navigateToDetails = (id: string) => {
    setSelectedBusinessId(id);
    setActiveTab('details');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            businesses={businesses.filter(b => b.status === 'APPROVED')}
            onSelectBusiness={navigateToDetails}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveTab('search');
            }}
            onSearch={(q) => {
              setSearchQuery(q);
              setActiveTab('search');
            }}
            onOpenRegisterUser={() => setActiveTab('profile')}
            onOpenRegisterBusiness={() => setActiveTab('business-reg')}
            onOpenAdmin={() => setActiveTab('admin')}
          />
        );
      case 'search':
        const filtered = businesses.filter(b => {
          const matchesStatus = b.status === 'APPROVED';
          const matchesCat = !selectedCategory || b.category === selectedCategory;
          const matchesQuery = !searchQuery || 
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            b.description.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesCat && matchesQuery;
        });
        return (
          <div className="p-4 space-y-4 max-w-4xl mx-auto">
            <button onClick={() => setActiveTab('home')} className="text-blue-600 font-medium mb-2">← Voltar</button>
            <h2 className="text-2xl font-bold">Resultados para {selectedCategory || searchQuery || 'Tudo'}</h2>
            {filtered.length === 0 ? (
              <p className="text-gray-500">Nenhuma empresa encontrada.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(b => (
                  <div key={b.id} onClick={() => navigateToDetails(b.id)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
                    <img src={b.imageUrl} alt={b.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                    <h3 className="font-bold text-lg">{b.name}</h3>
                    <p className="text-sm text-gray-500">{b.category} • {b.address.split('-')[0]}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm font-medium">{b.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'details':
        const biz = businesses.find(b => b.id === selectedBusinessId);
        if (!biz) return <div>Empresa não encontrada</div>;
        return (
          <BusinessDetails 
            business={biz} 
            reviews={reviews.filter(r => r.businessId === biz.id)}
            isFavorite={favorites.includes(biz.id)}
            onToggleFavorite={() => toggleFavorite(biz.id)}
            onBack={() => setActiveTab('home')}
            onSubmitReview={(rating, comment) => {
              if (!currentUser) return alert("Faça login para avaliar");
              addReview({
                id: Date.now().toString(),
                businessId: biz.id,
                userId: currentUser.id,
                userName: currentUser.name,
                rating,
                comment,
                date: new Date().toLocaleDateString()
              });
            }}
          />
        );
      case 'profile':
        return (
          <UserForms 
            user={currentUser} 
            onLogin={handleLogin} 
            onLogout={handleLogout}
            onBack={() => setActiveTab('home')}
            favorites={businesses.filter(b => favorites.includes(b.id))}
            onSelectBusiness={navigateToDetails}
          />
        );
      case 'business-reg':
        return (
          <BusinessForms 
            onSubmit={addBusiness} 
            onBack={() => setActiveTab('home')} 
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            businesses={businesses} 
            onApprove={(id) => setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'APPROVED' } : b))}
            onReject={(id) => setBusinesses(prev => prev.filter(b => b.id !== id))}
            onBack={() => setActiveTab('home')}
          />
        );
      default:
        return <div>Oops! 404.</div>;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header onHome={() => setActiveTab('home')} />
      <main className="animate-fadeIn">
        {renderContent()}
      </main>
      
      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 md:hidden z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">Início</span>
        </button>
        <button onClick={() => setActiveTab('search')} className={`flex flex-col items-center ${activeTab === 'search' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">🔎</span>
          <span className="text-[10px]">Buscar</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">👤</span>
          <span className="text-[10px]">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
