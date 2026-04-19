import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Plus, X, Pencil, Trash } from 'lucide-react';

export default function AdminAdvocates() {
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', type: '', focus: '', img: '' });

  useEffect(() => {
    const q = query(collection(db, 'advocates'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: any[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setAdvocates(results);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'advocates'), {
        name: formData.name,
        role: formData.role,
        type: formData.type,
        focus: formData.focus.split(',').map(s => s.trim()).filter(Boolean),
        img: formData.img,
        createdBy: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsAdding(false);
      setFormData({ name: '', role: '', type: '', focus: '', img: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to add profile");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    try {
      await deleteDoc(doc(db, 'advocates', id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete record");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-serif text-[var(--color-primary)]">Advocates & Team</h3>
        <button onClick={() => setIsAdding(true)} className="bg-[var(--color-primary)] text-white px-4 py-2 font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-[var(--color-gold)] transition-colors">
          <Plus size={16} /> Add Profile
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Add New Advocate</h4>
            <button onClick={() => setIsAdding(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Name (e.g. Adv. Jane Doe)" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border p-2 w-full text-sm" />
              <input type="text" placeholder="Role (e.g. Senior Partner)" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="border p-2 w-full text-sm" />
              <input type="text" placeholder="Expertise (e.g. Corporate Law)" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="border p-2 w-full text-sm" />
              <input type="url" placeholder="Image URL" required value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="border p-2 w-full text-sm" />
            </div>
            <textarea placeholder="Areas of Focus (Comma separated)" required value={formData.focus} onChange={e => setFormData({...formData, focus: e.target.value})} className="border p-2 w-full text-sm h-20" />
            <div className="flex justify-end">
              <button type="submit" className="bg-[var(--color-gold)] text-[var(--color-primary)] px-6 py-2 font-bold uppercase tracking-wider text-xs">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">Image</th>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Role & Type</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {advocates.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No advocates added yet.</td></tr>
            ) : advocates.map((adv) => (
              <tr key={adv.id} className="border-b border-gray-50">
                <td className="p-4 w-16"><img src={adv.img || 'https://via.placeholder.com/150'} alt={adv.name} className="w-10 h-10 object-cover rounded-full" /></td>
                <td className="p-4 font-bold text-[var(--color-primary)]">{adv.name}</td>
                <td className="p-4">
                  <div className="text-sm font-bold">{adv.role}</div>
                  <div className="text-xs text-gray-500">{adv.type}</div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(adv.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-sm ml-2">
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
