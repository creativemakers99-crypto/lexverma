import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Briefcase, ChevronRight, CheckCircle, Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!auth.currentUser) return;
      try {
        const uid = auth.currentUser.uid;
        const caseQ = query(collection(db, 'cases'), where('clientId', '==', uid));
        const caseSnap = await getDocs(caseQ);
        setCases(caseSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading cases...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-1">My Cases</h2>
          <p className="text-gray-500 text-sm">Track your ongoing and closed legal matters.</p>
        </div>
      </div>

      {cases.length === 0 ? (
         <div className="bg-white p-12 text-center rounded-sm border border-gray-100 shadow-sm">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Briefcase size={28} className="text-gray-300" />
           </div>
           <h3 className="font-bold text-[var(--color-primary)] text-lg mb-2">No Cases Found</h3>
           <p className="text-gray-500 mb-6">You don't have any active case histories on your portal yet.</p>
           <Link to="/contact" className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] transition-colors">Start a new inquiry</Link>
         </div>
      ) : (
         <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
           {cases.map((c, idx) => (
             <div key={c.id} className={`p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors`}>
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                   <h3 className="text-lg font-bold text-[var(--color-primary)]">{c.title}</h3>
                   <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm ${c.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                     {c.status || 'Active'}
                   </span>
                 </div>
                 <p className="text-sm text-gray-600 mb-4">{c.description}</p>
                 <div className="flex items-center gap-6 text-xs text-gray-500 uppercase font-bold tracking-wider">
                   {c.caseNumber && <span>Case No: <span className="text-[var(--color-primary)]">{c.caseNumber}</span></span>}
                   {c.advocate && <span>Advocate: <span className="text-[var(--color-primary)]">{c.advocate}</span></span>}
                 </div>
               </div>
               
               <div className="w-full md:w-64 shrink-0 flex flex-col justify-center">
                  <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                    <span>Progress</span>
                    <span className="text-[var(--color-gold)]">{c.progress || 30}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                     <div className="bg-[var(--color-gold)] h-full" style={{ width: c.progress ? `${c.progress}%` : '30%' }}></div>
                  </div>
                  <Link to={`/portal/cases/${c.id}`} className="w-full text-center block py-2 border border-[var(--color-primary)] text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                    View Details
                  </Link>
               </div>
             </div>
           ))}
         </div>
      )}
    </div>
  );
}
