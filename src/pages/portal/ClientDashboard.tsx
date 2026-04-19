import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Briefcase, Calendar, Clock, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  const [cases, setCases] = useState<any[]>([]);
  const [hearings, setHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!auth.currentUser) return;
      try {
        const uid = auth.currentUser.uid;
        
        // Fetch active cases
        const caseQ = query(collection(db, 'cases'), where('clientId', '==', uid));
        const caseSnap = await getDocs(caseQ);
        const caseData = caseSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCases(caseData);

        // Fetch upcoming hearings
        const hearingsQ = query(collection(db, 'hearings'), where('clientId', '==', uid), orderBy('date', 'asc'), limit(3));
        const hwSnap = await getDocs(hearingsQ);
        setHearings(hwSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-primary)] text-white p-6 md:p-8 rounded-sm shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Welcome back!</h2>
          <p className="text-[var(--color-gold)] font-bold text-xs md:text-sm uppercase tracking-widest mb-6">Your legal matters are securely managed.</p>
          <div className="flex gap-4">
            <Link to="/portal/cases" className="bg-[var(--color-gold)] text-[var(--color-primary)] px-6 py-2.5 font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-white transition-colors cursor-pointer">
              View Cases <ChevronRight size={16} />
            </Link>
            <Link to="/contact" className="border border-white/30 text-white px-6 py-2.5 font-bold uppercase tracking-wider text-xs hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors hidden sm:block">
              Message Advocate
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold text-lg text-[var(--color-primary)] flex items-center gap-2">
                <Briefcase size={20} className="text-[var(--color-gold)]" /> Active Cases
              </h3>
              <Link to="/portal/cases" className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-gold)] uppercase tracking-wider">View All</Link>
            </div>
            {cases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-gray-300" />
                </div>
                <p>No active cases currently linked to your profile.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cases.map(c => (
                  <div key={c.id} className="border border-gray-100 p-4 rounded-sm hover:border-[var(--color-gold)] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[var(--color-primary)]">{c.title}</h4>
                      <span className="bg-blue-50 text-blue-700 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm">{c.status || 'In Progress'}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                    {/* Basic Progress Bar */}
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                       <div className="bg-[var(--color-gold)] h-full" style={{ width: c.progress ? `${c.progress}%` : '30%' }}></div>
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Drafting Phase</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-6">
            <h3 className="font-serif font-bold text-lg text-[var(--color-primary)] flex items-center gap-2 mb-6">
              <Calendar size={20} className="text-[var(--color-gold)]" /> Upcoming Hearings
            </h3>
            {hearings.length === 0 ? (
              <div className="text-center py-6 text-gray-500 border-t border-gray-50">
                <p className="text-sm">No upcoming hearings scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hearings.map(h => (
                  <div key={h.id} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="text-center shrink-0">
                      <div className="text-[10px] uppercase font-bold text-gray-400">{new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                      <div className="text-xl font-serif font-bold text-[var(--color-primary)]">{new Date(h.date).getDate()}</div>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800">{h.court}</h5>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock size={12} /> {h.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[var(--color-gold)] text-[var(--color-primary)] p-6 shadow-sm rounded-sm text-center">
            <h3 className="font-serif font-bold text-lg mb-2">Need immediate assistance?</h3>
            <p className="text-sm opacity-90 mb-4">Book a priority consultation with your assigned advocate.</p>
            <Link to="/booking" className="inline-block bg-[var(--color-primary)] text-white px-6 py-2.5 font-bold uppercase tracking-wider text-xs hover:bg-[#0b1f3a]/90 transition-colors">
              Schedule Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
