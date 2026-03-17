
import React, { useState } from 'react';
import { User, Business } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../src/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserFormsProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onBack: () => void;
  favorites: Business[];
  onSelectBusiness: (id: string) => void;
}

const UserForms: React.FC<UserFormsProps> = ({ user, onLogin, onLogout, onBack, favorites, onSelectBusiness }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const newUser: User = {
          id: userCredential.user.uid,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: 'CONSUMER',
          favorites: []
        };
        await onLogin(newUser);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        // User profile will be fetched by App.tsx listener
      }
    } catch (error) {
      alert("Erro na autenticação: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user profile exists
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const newUser: User = {
          id: user.uid,
          name: user.displayName || 'Usuário Google',
          email: user.email || '',
          phone: '',
          role: 'CONSUMER',
          favorites: []
        };
        await onLogin(newUser);
      }
    } catch (error) {
      alert("Erro no login com Google: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <button onClick={onBack} className="text-blue-600 font-medium">← Voltar</button>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500 text-sm">{user.phone}</p>
          </div>
          <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100">Sair</button>
        </div>

        <section className="space-y-4">
          <h3 className="text-xl font-bold">Meus Favoritos</h3>
          {favorites.length === 0 ? (
            <p className="text-gray-400">Você ainda não favoritou nenhuma empresa.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map(b => (
                <div key={b.id} onClick={() => onSelectBusiness(b.id)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:border-blue-200">
                  <img src={b.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold">{b.name}</h4>
                    <p className="text-xs text-gray-500">{b.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg">I</div>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8">{isRegister ? 'Criar Conta' : 'Acessar Conta'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                required 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
              <input 
                type="tel" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              required 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : (isRegister ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continue com</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          {isRegister ? 'Já possui conta?' : 'Ainda não tem conta?'} 
          <button onClick={() => setIsRegister(!isRegister)} className="ml-1 text-blue-600 font-bold hover:underline">
            {isRegister ? 'Fazer login' : 'Cadastre-se grátis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForms;
