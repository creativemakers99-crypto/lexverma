import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    inquiries: 0,
    advocates: 0,
    testimonials: 0
  });

  useEffect(() => {
    async function fetchStats() {
      // In a real app we might use aggregation queries (count)
      // but for now we'll just fetch small lists or rely on simple metric checks.
      try {
        const inqSnap = await getDocs(query(collection(db, 'inquiries'), limit(100)));
        const advSnap = await getDocs(query(collection(db, 'advocates'), limit(100)));
        const testSnap = await getDocs(query(collection(db, 'testimonials'), limit(100)));
        
        setStats({
          inquiries: inqSnap.size,
          advocates: advSnap.size,
          testimonials: testSnap.size
        });
      } catch (e) {
        console.error("Error fetching stats:", e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <MessageSquare size={24} />
          </div>
          <div>
             <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Inquiries</p>
             <h3 className="text-3xl font-serif font-bold text-[var(--color-primary)]">{stats.inquiries}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold-50 text-[var(--color-gold)] rounded-full flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
             <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Team Profiles</p>
             <h3 className="text-3xl font-serif font-bold text-[var(--color-primary)]">{stats.advocates}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
             <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Reviews</p>
             <h3 className="text-3xl font-serif font-bold text-[var(--color-primary)]">{stats.testimonials}</h3>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
        <h3 className="font-serif font-bold text-xl text-[var(--color-primary)] mb-4">Welcome to the Provider Dashboard</h3>
        <p className="text-gray-600">
          From this panel, you can view new legal inquiries, manage website content, and update the advocate directory. 
          Use the sidebar on the left to navigate between different administration areas.
        </p>
      </div>
    </div>
  );
}
