import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Scale, LogOut, LayoutDashboard, Briefcase, Calendar, FileText, CreditCard, Bell, MessageSquare } from 'lucide-react';

export default function ClientLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Ensure client doc exists
      const docRef = doc(db, 'clients', result.user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: result.user.displayName || 'Client',
          email: result.user.email,
          phone: result.user.phoneNumber || '',
          status: 'active',
          updatedAt: new Date()
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (authMode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'clients', result.user.uid), {
          name: email.split('@')[0],
          email: result.user.email,
          phone: '',
          status: 'active',
          updatedAt: new Date()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/portal', icon: <LayoutDashboard size={20} /> },
    { name: 'Smart Intake', path: '/portal/intake', icon: <FileText size={20} /> },
    { name: 'My Cases', path: '/portal/cases', icon: <Briefcase size={20} /> },
    { name: 'Hearings', path: '/portal/hearings', icon: <Calendar size={20} /> },
    { name: 'eVault', path: '/portal/documents', icon: <FileText size={20} /> },
    { name: 'Billing', path: '/portal/billing', icon: <CreditCard size={20} /> },
    { name: 'Communication', path: '/portal/messages', icon: <MessageSquare size={20} /> },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Scale className="animate-spin text-[var(--color-primary)]" size={48} /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-sm shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <Scale size={48} className="text-[var(--color-gold)] mx-auto mb-4" />
            <h1 className="text-2xl font-serif text-[var(--color-primary)] font-bold mb-1">Client Portal</h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Secure Access</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-500 p-3 text-sm rounded mb-4">{error}</div>}
          
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1 font-bold">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 p-2 text-sm focus:border-[var(--color-gold)] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1 font-bold">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 p-2 text-sm focus:border-[var(--color-gold)] focus:outline-none" />
            </div>
            <button type="submit" className="w-full py-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-gold)] hover:text-[#0b1f3a] transition-colors font-bold uppercase tracking-wider text-sm">
              {authMode === 'login' ? 'Secure Login' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">OR</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button onClick={handleGoogleAuth} className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 mb-4">
            Sign in with Google
          </button>
          
          <div className="text-center">
            <button onClick={() => setAuthMode(m => m === 'login' ? 'register' : 'login')} className="text-xs text-[var(--color-gold)] hover:underline font-bold uppercase tracking-wide">
              {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // To prevent horizontal scroll issues on mobile, layout is responsive
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[var(--color-primary)] text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-serif font-bold">
          <Scale className="text-[var(--color-gold)]" size={20} /> Client Portal
        </div>
        <button onClick={() => signOut(auth)}><LogOut size={20} /></button>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[var(--color-primary)] text-white flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 font-serif font-bold text-xl mb-1">
            <Scale className="text-[var(--color-gold)]" size={24} />
            <span className="tracking-wide">LexVerma</span>
          </div>
          <div className="text-[10px] text-[var(--color-gold)] uppercase tracking-widest mt-1">Client Portal</div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm ${location.pathname === item.path ? 'bg-[var(--color-gold)] text-[var(--color-primary)] font-bold' : 'hover:bg-white/10'}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-white/70 hover:text-white w-full px-4 py-2 text-sm">
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </div>

      {/* Mobile nav pills */}
      <div className="flex md:hidden overflow-x-auto bg-white border-b p-2 gap-2 sticky top-0 z-10 shrink-0">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${location.pathname === item.path ? 'bg-[var(--color-primary)] text-[var(--color-gold)]' : 'bg-gray-100 text-gray-600'}`}>
            {item.name}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:h-screen overflow-hidden">
        <header className="hidden md:flex bg-white shadow-sm h-16 items-center justify-between px-8 shrink-0">
          <h2 className="font-serif font-bold text-xl text-[var(--color-primary)]">
            {menuItems.find(i => i.path === location.pathname)?.name || 'Portal'}
          </h2>
          <div className="flex items-center gap-4">
             <button className="text-gray-400 hover:text-[var(--color-gold)] relative">
               <Bell size={20} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="text-sm font-bold text-[var(--color-primary)] border-l pl-4 border-gray-200">{user.email}</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
