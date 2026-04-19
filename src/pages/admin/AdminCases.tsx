import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, X, Trash, Briefcase, Calendar } from 'lucide-react';

export default function AdminCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', caseNumber: '', description: '', clientId: '', advocate: '', progress: '0', status: 'active' });

  useEffect(() => {
    const q = query(collection(db, 'cases'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCases(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    // Fetch clients for dropdown
    onSnapshot(query(collection(db, 'clients')), (snap) => {
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.clientId) { alert("Please select a client."); return; }
      
      await addDoc(collection(db, 'cases'), {
        ...formData,
        progress: parseInt(formData.progress, 10),
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setFormData({ title: '', caseNumber: '', description: '', clientId: '', advocate: '', progress: '0', status: 'active' });
    } catch (err) {
      console.error(err);
      alert("Failed to add case");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return;
    try { await deleteDoc(doc(db, 'cases', id)); } catch(e) { console.error(e); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-serif text-[var(--color-primary)]">Matters & Cases</h3>
        <button onClick={() => setIsAdding(true)} className="bg-[var(--color-primary)] text-white px-4 py-2 font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-[var(--color-gold)] transition-colors">
          <Plus size={16} /> New Case
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Create New Matter</h4>
            <button onClick={() => setIsAdding(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Title/Reference" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border p-2 w-full text-sm" />
              <input type="text" placeholder="Case Number (Optional)" value={formData.caseNumber} onChange={e => setFormData({...formData, caseNumber: e.target.value})} className="border p-2 w-full text-sm" />
              
              <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="border p-2 w-full text-sm">
                 <option value="" disabled>Select Client</option>
                 {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
              
              <input type="text" placeholder="Assigned Advocate" value={formData.advocate} onChange={e => setFormData({...formData, advocate: e.target.value})} className="border p-2 w-full text-sm" />
              
              <div className="flex flex-col">
                 <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Progress %</label>
                 <input type="number" min="0" max="100" placeholder="0" required value={formData.progress} onChange={e => setFormData({...formData, progress: e.target.value})} className="border p-2 w-full text-sm" />
              </div>

              <div className="flex flex-col">
                 <label className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Status</label>
                 <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="border p-2 w-full text-sm">
                   <option value="active">Active</option>
                   <option value="closed">Closed / Disposed</option>
                 </select>
              </div>
            </div>
            <textarea placeholder="Case Description & Notes" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="border p-2 w-full text-sm h-20" />
            <div className="flex justify-end">
              <button type="submit" className="bg-[var(--color-gold)] text-[var(--color-primary)] px-6 py-2 font-bold uppercase tracking-wider text-xs">Create Case</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">Case Info</th>
              <th className="p-4 font-bold">Client</th>
              <th className="p-4 font-bold">Progress</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No cases found.</td></tr>
            ) : cases.map((c) => (
              <tr key={c.id} className="border-b border-gray-50">
                <td className="p-4 max-w-[200px]">
                  <Link to={`/admin/cases/${c.id}`} className="font-bold text-[var(--color-primary)] hover:text-[var(--color-gold)] transition-colors">{c.title}</Link>
                  <div className="text-xs text-gray-500 truncate">{c.caseNumber}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm">{clients.find(client => client.id === c.clientId)?.name || 'Unknown Client'}</div>
                </td>
                <td className="p-4">
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden w-24">
                     <div className="bg-[var(--color-gold)] h-full" style={{ width: c.progress ? `${c.progress}%` : '0%' }}></div>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 mt-1">{c.status}</div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-sm ml-2 inline-flex">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
