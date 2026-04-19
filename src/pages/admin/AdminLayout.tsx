import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Scale, Users, FileText, Settings, LogOut, LayoutDashboard, MessageSquare, Briefcase, CheckSquare, CalendarDays } from 'lucide-react';

export default function AdminLayout() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is an admin
        try {
          const docRef = doc(db, 'admins', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() || currentUser.email === 'rv8941743@gmail.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(error => {
      console.error(error);
      alert("Error signing in.");
    });
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Clients', path: '/admin/clients', icon: <Users size={20} /> },
    { name: 'Manage Cases', path: '/admin/cases', icon: <Briefcase size={20} /> },
    { name: 'Tasks', path: '/admin/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Cause List', path: '/admin/causelist', icon: <CalendarDays size={20} /> },
    { name: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare size={20} /> },
    { name: 'Team Profiles', path: '/admin/advocates', icon: <Users size={20} /> },
    { name: 'Client Reviews', path: '/admin/reviews', icon: <FileText size={20} /> },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Scale className="animate-spin text-[var(--color-primary)]" size={48} /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-sm shadow-xl max-w-md w-full text-center">
          <Scale size={48} className="text-[var(--color-gold)] mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-[var(--color-primary)] font-bold mb-6">Admin Login</h1>
          <button onClick={handleLogin} className="w-full py-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-gold)] transition-colors font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-sm shadow-xl max-w-md w-full text-center">
          <div className="text-red-500 mb-4 mx-auto w-max"><Scale size={48} /></div>
          <h1 className="text-xl font-serif text-[var(--color-primary)] font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You do not have administrator privileges to access this area.</p>
          <button onClick={() => signOut(auth)} className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--color-primary)] text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-center items-center gap-2 font-serif font-bold text-xl mb-1">
            <Scale className="text-[var(--color-gold)]" size={24} />
            <span className="tracking-wide">LexVerma</span>
          </div>
          <div className="text-[10px] text-[var(--color-gold)] text-center uppercase tracking-widest">Admin Portal</div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${location.pathname === item.path ? 'bg-[var(--color-gold)] text-[var(--color-primary)] font-bold' : 'hover:bg-white/10'}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-white/70 hover:text-white w-full px-4 py-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-serif font-bold text-xl text-[var(--color-primary)]">
            {menuItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-3">
             <div className="text-sm text-gray-600">{user.email}</div>
             <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-8 h-8 rounded-full" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
