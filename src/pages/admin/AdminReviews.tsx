import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, X, Trash, Star } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', case: '', text: '', rating: '5' });

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: any[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setReviews(results);
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
      await addDoc(collection(db, 'testimonials'), {
        name: formData.name,
        case: formData.case,
        text: formData.text,
        rating: parseInt(formData.rating, 10),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsAdding(false);
      setFormData({ name: '', case: '', text: '', rating: '5' });
    } catch (err) {
      console.error(err);
      alert("Failed to add record");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-serif text-[var(--color-primary)]">Client Reviews</h3>
        <button onClick={() => setIsAdding(true)} className="bg-[var(--color-primary)] text-white px-4 py-2 font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-[var(--color-gold)] transition-colors">
          <Plus size={16} /> Add Review
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Add New Review</h4>
            <button onClick={() => setIsAdding(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Client Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border p-2 w-full text-sm" />
              <input type="text" placeholder="Case Type (e.g. Criminal Defense)" required value={formData.case} onChange={e => setFormData({...formData, case: e.target.value})} className="border p-2 w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Rating</label>
              <select value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="border p-2 w-full text-sm">
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <textarea placeholder="Review Content" required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="border p-2 w-full text-sm h-24" />
            <div className="flex justify-end">
              <button type="submit" className="bg-[var(--color-gold)] text-[var(--color-primary)] px-6 py-2 font-bold uppercase tracking-wider text-xs">Save Review</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">Client / Case</th>
              <th className="p-4 font-bold">Review</th>
              <th className="p-4 font-bold">Rating</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No reviews added yet.</td></tr>
            ) : reviews.map((r) => (
              <tr key={r.id} className="border-b border-gray-50">
                <td className="p-4">
                  <div className="font-bold text-[var(--color-primary)]">{r.name}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{r.case}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-sm"><p className="line-clamp-2 italic">"{r.text}"</p></td>
                <td className="p-4 flex text-[var(--color-gold)]">
                  {Array(r.rating).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-sm ml-2">
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
