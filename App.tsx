
import React, { useState, useEffect, useMemo } from 'react';
import { User, Business, Review, Category, UserRole } from './types';
import { CATEGORIES, MOCK_BUSINESSES } from './constants';
import Home from './components/Home';
import BusinessDetails from './components/BusinessDetails';
import UserForms from './components/UserForms';
import BusinessForms from './components/BusinessForms';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import FeaturedBusinesses from './components/FeaturedBusinesses';
import Pricing from './components/Pricing';
import { Home as HomeIcon, Star, Search, User as UserIcon, ArrowLeft, ShieldCheck } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from './src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';

const App: React.FC = () => {
  // Persistence state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'profile' | 'admin' | 'business-reg' | 'details' | 'featured' | 'pricing'>('home');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const userRef = doc(db, 'users', user.uid);
        onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data() as User);
            setFavorites((docSnap.data() as User).favorites || []);
          } else {
            // New user, profile will be created on first login/register
            setCurrentUser(null);
          }
          setIsAuthReady(true);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        });
      } else {
        setCurrentUser(null);
        setFavorites([]);
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore listeners for businesses and reviews
  useEffect(() => {
    const businessesRef = collection(db, 'businesses');
    const unsubscribeBusinesses = onSnapshot(businessesRef, async (snapshot) => {
      let bizData = snapshot.docs.map(doc => doc.data() as Business);
      
      // Seed with MOCK_BUSINESSES if Firestore is empty
      if (bizData.length === 0 && isAuthReady) {
        try {
          for (const biz of MOCK_BUSINESSES) {
            await setDoc(doc(db, 'businesses', biz.id), biz);
          }
          // The listener will trigger again with the new data
        } catch (error) {
          console.error("Seeding error:", error);
        }
      }
      setBusinesses(bizData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'businesses');
    });

    const reviewsRef = collection(db, 'reviews');
    const unsubscribeReviews = onSnapshot(reviewsRef, (snapshot) => {
      const reviewData = snapshot.docs.map(doc => doc.data() as Review);
      setReviews(reviewData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    return () => {
      unsubscribeBusinesses();
      unsubscribeReviews();
    };
  }, [isAuthReady]);

  const handleLogin = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, user, { merge: true });
      setCurrentUser(user);
      setActiveTab('home');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.id}`);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setActiveTab('home');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addBusiness = async (biz: Business) => {
    try {
      const bizRef = doc(db, 'businesses', biz.id);
      await setDoc(bizRef, biz);
      
      if (editingBusiness) {
        setEditingBusiness(null);
        setActiveTab('admin');
        alert("Alterações salvas com sucesso!");
      } else {
        setActiveTab('home');
        alert("Seu cadastro foi enviado para análise!");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `businesses/${biz.id}`);
    }
  };

  const approveBusiness = async (id: string) => {
    try {
      const bizRef = doc(db, 'businesses', id);
      await updateDoc(bizRef, { status: 'APPROVED' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `businesses/${id}`);
    }
  };

  const rejectBusiness = async (id: string) => {
    try {
      const bizRef = doc(db, 'businesses', id);
      await deleteDoc(bizRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `businesses/${id}`);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const biz = businesses.find(b => b.id === id);
      if (!biz) return;
      const bizRef = doc(db, 'businesses', id);
      await updateDoc(bizRef, { isFeatured: !biz.isFeatured });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `businesses/${id}`);
    }
  };

  const handleEditBusiness = (biz: Business) => {
    setEditingBusiness(biz);
    setActiveTab('business-reg');
  };

  const addReview = async (review: Review) => {
    try {
      const reviewRef = doc(db, 'reviews', review.id);
      await setDoc(reviewRef, review);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `reviews/${review.id}`);
    }
  };

  const toggleFavorite = async (bizId: string) => {
    if (!currentUser) return alert("Faça login para favoritar");
    try {
      const newFavorites = favorites.includes(bizId) 
        ? favorites.filter(id => id !== bizId) 
        : [...favorites, bizId];
      
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { favorites: newFavorites });
      setFavorites(newFavorites);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
    }
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
            onOpenRegisterBusiness={() => setActiveTab('pricing')}
            onOpenAdmin={() => setActiveTab('admin')}
            onOpenFeatured={() => setActiveTab('featured')}
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

        const sorted = [...filtered].sort((a, b) => {
          const priority: Record<string, number> = { 'OURO': 3, 'PRATA': 2, 'BRONZE': 1 };
          return (priority[b.plan] || 0) - (priority[a.plan] || 0);
        });

        return (
          <div className="p-4 space-y-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <button onClick={() => setActiveTab('home')} className="text-blue-600 font-medium flex items-center gap-1">
                <ArrowLeft size={16} /> Voltar
              </button>
              <button 
                onClick={() => setActiveTab('pricing')}
                className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-orange-700 transition-all"
              >
                Cadastrar Empresa
              </button>
            </div>
            <h2 className="text-2xl font-bold">Resultados para {selectedCategory || searchQuery || 'Tudo'}</h2>
            {sorted.length === 0 ? (
              <p className="text-gray-500">Nenhuma empresa encontrada.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sorted.map(b => (
                  <div key={b.id} onClick={() => navigateToDetails(b.id)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group">
                    {b.plan !== 'BRONZE' && (
                      <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                        <ShieldCheck size={14} fill="currentColor" className="text-white" />
                      </div>
                    )}
                    <img src={b.imageUrl} alt={b.name} className="w-full h-40 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-500" />
                    <h3 className="font-bold text-lg flex items-center gap-1">
                      {b.name}
                    </h3>
                    <p className="text-sm text-gray-500">{b.category} • {b.address.split('-')[0]}</p>
                    <div className="flex items-center mt-2 justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm font-medium">{b.rating.toFixed(1)}</span>
                      </div>
                      {b.plan === 'OURO' && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">Premium</span>
                      )}
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
            onBack={() => {
              setEditingBusiness(null);
              setActiveTab('home');
            }} 
            initialData={editingBusiness || undefined}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            businesses={businesses} 
            onApprove={approveBusiness}
            onReject={rejectBusiness}
            onToggleFeatured={toggleFeatured}
            onEdit={handleEditBusiness}
            onBack={() => setActiveTab('home')}
          />
        );
      case 'featured':
        return (
          <FeaturedBusinesses 
            businesses={businesses}
            onSelectBusiness={navigateToDetails}
            onOpenRegisterBusiness={() => setActiveTab('pricing')}
            onBack={() => setActiveTab('home')}
          />
        );
      case 'pricing':
        return (
          <Pricing 
            onSelectPlan={(plan) => {
              console.log(`Selected plan: ${plan}`);
              setActiveTab('business-reg');
            }}
            onBack={() => setActiveTab('featured')}
          />
        );
      default:
        return <div>Oops! 404.</div>;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header 
        onHome={() => setActiveTab('home')} 
        onFeatured={() => setActiveTab('featured')}
        onTurismo={() => {
          setSelectedCategory('Turismo');
          setSearchQuery('');
          setActiveTab('search');
        }}
        onEventos={() => {
          setSelectedCategory('Eventos');
          setSearchQuery('');
          setActiveTab('search');
        }}
      />
      <main className="animate-fadeIn">
        {renderContent()}
      </main>
      
      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 md:hidden z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
          <HomeIcon size={20} />
          <span className="text-[10px] mt-1">Início</span>
        </button>
        <button onClick={() => setActiveTab('featured')} className={`flex flex-col items-center ${activeTab === 'featured' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Star size={20} className={activeTab === 'featured' ? 'fill-blue-600' : ''} />
          <span className="text-[10px] mt-1">Destaque</span>
        </button>
        <button onClick={() => setActiveTab('search')} className={`flex flex-col items-center ${activeTab === 'search' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Search size={20} />
          <span className="text-[10px] mt-1">Buscar</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
          <UserIcon size={20} />
          <span className="text-[10px] mt-1">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
