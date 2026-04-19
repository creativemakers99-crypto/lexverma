import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { ArrowLeft, Clock, MessageSquare, Plus, FileText, CheckCircle, Circle } from 'lucide-react';

export default function AdminCaseDetail() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newStage, setNewStage] = useState('');
  const [newAction, setNewAction] = useState('');
  
  const [noteType, setNoteType] = useState('Internal Notes');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!caseId) return;

    const fetchDetail = async () => {
      const d = await getDoc(doc(db, 'cases', caseId));
      if (d.exists()) {
        setCaseData({ id: d.id, ...d.data() });
      }
      setLoading(false);
    };
    fetchDetail();

    const qStages = query(collection(db, `cases/${caseId}/stages`), orderBy('createdAt', 'asc'));
    const unStages = onSnapshot(qStages, (snap) => setStages(snap.docs.map(d => ({id: d.id, ...d.data()}))));

    const qNotes = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unNotes = onSnapshot(qNotes, (snap) => {
      const allNotes = snap.docs.map(d => ({id: d.id, ...d.data()} as any));
      setNotes(allNotes.filter(n => n.caseId === caseId));
    });

    return () => { unStages(); unNotes(); };
  }, [caseId]);

  const addStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStage.trim() || !caseId) return;
    try {
      await addDoc(collection(db, `cases/${caseId}/stages`), {
        title: newStage,
        nextAction: newAction,
        completed: false,
        createdAt: serverTimestamp()
      });
      setNewStage(''); setNewAction('');
    } catch(err) { console.error(err); }
  };

  const toggleStage = async (stageId: string, current: boolean) => {
    if(!caseId) return;
    try {
      await updateDoc(doc(db, `cases/${caseId}/stages`, stageId), { completed: !current });
    } catch(err) { console.error(err); }
  }

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !caseId || !auth.currentUser) return;
    try {
      await addDoc(collection(db, 'notes'), {
        caseId,
        type: noteType,
        text: newNote,
        author: auth.currentUser.email,
        createdAt: serverTimestamp()
      });
      setNewNote('');
    } catch(err) { console.error(err); }
  };

  if (loading) return <div>Loading...</div>;
  if (!caseData) return <div>Case not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/admin/cases" className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[var(--color-gold)] flex items-center gap-2 mb-4">
        <ArrowLeft size={16} /> Back to Cases
      </Link>
      
      <div className="bg-[var(--color-primary)] text-white p-6 md:p-8 rounded-sm shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h2 className="text-2xl font-serif font-bold mb-1">{caseData.title}</h2>
             <div className="text-[var(--color-gold)] text-sm font-bold flex items-center gap-4 uppercase tracking-wider">
               <span>{caseData.caseNumber || 'No Case No.'}</span>
               <span>•</span>
               <span>Adv: {caseData.advocate}</span>
             </div>
           </div>
           <div className={`px-4 py-2 font-bold uppercase tracking-widest text-xs border ${caseData.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}`}>
             {caseData.status}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stages Pipeline */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-6">
          <h3 className="font-bold font-serif text-xl text-[var(--color-primary)] mb-6 flex items-center gap-2"><Clock size={20} className="text-[var(--color-gold)]" /> Case Progress Pipeline</h3>
          
          <div className="space-y-4 mb-8">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="relative pl-8">
                 {/* Timeline line */}
                 {idx !== stages.length - 1 && <div className="absolute top-6 left-[11px] w-0.5 h-full bg-gray-200"></div>}
                 
                 {/* Status Icon */}
                 <div className="absolute left-0 top-1 cursor-pointer" onClick={() => toggleStage(stage.id, stage.completed)}>
                   {stage.completed ? <CheckCircle size={24} className="text-green-500 bg-white" /> : <Circle size={24} className="text-gray-300 bg-white" />}
                 </div>
                 
                 <div className={`border p-4 rounded-sm ${stage.completed ? 'bg-gray-50 border-gray-200 opacity-70' : 'border-[var(--color-gold)] bg-gold-50/10'}`}>
                   <h4 className={`font-bold ${stage.completed ? 'text-gray-500 line-through' : 'text-[var(--color-primary)]'}`}>{stage.title}</h4>
                   {stage.nextAction && (
                     <div className="mt-2 text-sm text-gray-600 bg-white p-2 border border-gray-100 italic">
                       <span className="font-bold text-xs uppercase text-[var(--color-gold)] block not-italic mb-1">Next Action</span>
                       {stage.nextAction}
                     </div>
                   )}
                   <div className="text-xs text-gray-400 mt-2">Added: {stage.createdAt?.toDate ? stage.createdAt.toDate().toLocaleDateString() : 'Just now'}</div>
                 </div>
              </div>
            ))}
            {stages.length === 0 && <div className="text-gray-500 text-sm italic">No stages defined yet.</div>}
          </div>

          <form onSubmit={addStage} className="bg-gray-50 p-4 border border-gray-200 rounded-sm space-y-3">
             <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500">Add Next Stage</h4>
             <input type="text" placeholder="Stage Name (e.g. Evidence Recording)" value={newStage} required onChange={e => setNewStage(e.target.value)} className="w-full border p-2 text-sm" />
             <input type="text" placeholder="Estimated Next Action (Optional)" value={newAction} onChange={e => setNewAction(e.target.value)} className="w-full border p-2 text-sm" />
             <button type="submit" className="w-full bg-[var(--color-primary)] text-white p-2 font-bold uppercase tracking-wider text-xs hover:bg-[var(--color-gold)] transition-colors">Add to Pipeline</button>
          </form>
        </div>

        {/* Private Notes Message Pad */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-6 flex flex-col h-[700px]">
          <h3 className="font-bold font-serif text-xl text-[var(--color-primary)] mb-6 flex items-center gap-2"><MessageSquare size={20} className="text-[var(--color-gold)]" /> Message Pad</h3>
          
          <div className="flex gap-2 border-b border-gray-200 mb-4 pb-2 overflow-x-auto shrink-0 custom-scrollbar">
             {['Internal Notes', 'Client Log', 'Hearing Notes', 'Strategy'].map(t => (
               <button key={t} onClick={() => setNoteType(t)} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap rounded-sm ${noteType === t ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                 {t}
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
             {notes.filter(n => n.type === noteType).length === 0 && <div className="text-gray-400 text-sm text-center mt-10">No {noteType.toLowerCase()} yet.</div>}
             {notes.filter(n => n.type === noteType).map(note => (
               <div key={note.id} className="bg-gray-50 p-3 border-l-2 border-[var(--color-gold)] rounded-sm text-sm">
                  <div className="text-gray-800 whitespace-pre-wrap">{note.text}</div>
                  <div className="mt-2 text-xs text-gray-400 flex justify-between items-center bg-gray-100 px-2 py-1 rounded-sm">
                    <span className="font-bold truncate max-w-[150px]" title={note.author}>{note.author}</span>
                    <span>{note.createdAt?.toDate ? note.createdAt.toDate().toLocaleString() : 'Just now'}</span>
                  </div>
               </div>
             ))}
          </div>

          <form onSubmit={addNote} className="shrink-0 mt-auto pt-4 border-t border-gray-100">
             <textarea 
               placeholder={`Add ${noteType.toLowerCase()}...`}
               required value={newNote} onChange={e=>setNewNote(e.target.value)}
               className="w-full border border-gray-300 p-3 text-sm focus:border-[var(--color-gold)] outline-none min-h-[100px] mb-2" 
             />
             <button type="submit" className="w-full bg-[var(--color-gold)] text-[var(--color-primary)] p-2 font-bold uppercase tracking-wider text-xs hover:bg-[var(--color-primary)] hover:text-white transition-colors">Save Note</button>
          </form>
        </div>
      </div>
    </div>
  );
}
