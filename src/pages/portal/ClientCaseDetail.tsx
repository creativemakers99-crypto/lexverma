import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { ArrowLeft, Clock, CheckCircle, Circle, MapPin, Watch } from 'lucide-react';

export default function ClientCaseDetail() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [hearings, setHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;

    const fetchDetail = async () => {
      const d = await getDoc(doc(db, 'cases', caseId));
      if (d.exists() && (!auth.currentUser || d.data().clientId === auth.currentUser.uid)) {
        setCaseData({ id: d.id, ...d.data() });
      }
      setLoading(false);
    };
    fetchDetail();

    const qStages = query(collection(db, `cases/${caseId}/stages`), orderBy('createdAt', 'asc'));
    const unStages = onSnapshot(qStages, (snap) => setStages(snap.docs.map(d => ({id: d.id, ...d.data()}))));

    // For CauseList integration: query any cause lists matching this case title/number (simplified match)
    // Normally we'd link via caseId directly, assuming the admin enters the caseTitle matching exactly for demo.
    // We will just fetch hearigs where clientId == currentUser.uid for now as fallback.

    return () => { unStages(); };
  }, [caseId]);

  if (loading) return <div>Loading...</div>;
  if (!caseData) return <div>Access Denied or Case Not Found</div>;

  return (
    <div className="space-y-6">
      <Link to="/portal/cases" className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[var(--color-gold)] flex items-center gap-2 mb-4">
        <ArrowLeft size={16} /> Back to My Cases
      </Link>
      
      <div className="bg-[var(--color-primary)] text-white p-6 md:p-8 rounded-sm shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h2 className="text-2xl font-serif font-bold mb-1">{caseData.title}</h2>
             <div className="text-[var(--color-gold)] text-sm font-bold flex items-center gap-4 uppercase tracking-wider">
               <span>{caseData.caseNumber || 'Pending Case No.'}</span>
               <span className="hidden sm:inline">•</span>
               <span>Adv: {caseData.advocate}</span>
             </div>
           </div>
           <div className={`px-4 py-2 font-bold uppercase tracking-widest text-xs border bg-white/10 text-white border-white/20`}>
             Status: {caseData.status}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Case Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
             <h3 className="font-bold text-[var(--color-primary)] mb-4">Case Overview</h3>
             <div className="text-gray-600 text-sm whitespace-pre-wrap">{caseData.description}</div>
             <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
               <span className="font-bold text-gray-500 uppercase tracking-widest">Added On</span>
               <span className="text-gray-800 font-bold">{caseData.createdAt?.toDate ? caseData.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
             </div>
          </div>
        </div>

        {/* Stages Pipeline */}
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-sm p-6">
          <h3 className="font-bold font-serif text-xl text-[var(--color-primary)] mb-6 flex items-center gap-2"><Clock size={20} className="text-[var(--color-gold)]" /> Case Progress</h3>
          
          <div className="space-y-4">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="relative pl-8">
                 {/* Timeline line */}
                 {idx !== stages.length - 1 && <div className="absolute top-6 left-[11px] w-0.5 h-full bg-gray-200"></div>}
                 
                 {/* Status Icon */}
                 <div className="absolute left-0 top-1">
                   {stage.completed ? <CheckCircle size={24} className="text-[var(--color-gold)] bg-white" /> : <Circle size={24} className="text-gray-300 bg-white" />}
                 </div>
                 
                 <div className={`p-4 rounded-sm border ${stage.completed ? 'bg-gold-50/30 border-[var(--color-gold)]/30' : 'bg-gray-50 border-gray-200'}`}>
                   <h4 className={`font-bold ${stage.completed ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>{stage.title}</h4>
                   {stage.nextAction && !stage.completed && (
                     <div className="mt-2 text-sm text-gray-600 bg-white p-2 border border-gray-100 italic">
                       <span className="font-bold text-xs uppercase text-[var(--color-gold)] block not-italic mb-1">Next Expected Action</span>
                       {stage.nextAction}
                     </div>
                   )}
                 </div>
              </div>
            ))}
            {stages.length === 0 && <div className="text-gray-500 text-sm italic">Case has just been registered. Stages will be updated soon.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
