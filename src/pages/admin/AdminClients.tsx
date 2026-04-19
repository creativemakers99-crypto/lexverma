import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User, Mail, Phone, Edit, Trash, CheckCircle } from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: any[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setClients(results);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'clients', id), {
        status: currentStatus === 'active' ? 'inactive' : 'active'
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client? This does not delete their auth record, only the db profile.')) return;
    try {
      await deleteDoc(doc(db, 'clients', id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-serif text-[var(--color-primary)]">Client Profiles</h3>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">Client Name</th>
              <th className="p-4 font-bold">Contact</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No clients registered yet.</td></tr>
            ) : clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0 font-serif">
                       {client.name ? client.name.charAt(0).toUpperCase() : <User size={14} />}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-primary)]">{client.name || 'Unnamed Client'}</div>
                      <div className="text-xs text-gray-400">ID: {client.id.substring(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600 flex items-center gap-2"><Mail size={12} className="text-gray-400" /> {client.email}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1"><Phone size={12} className="text-gray-400" /> {client.phone || 'N/A'}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                    client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {client.status === 'active' ? <CheckCircle size={10} /> : <User size={10} />}
                    {client.status}
                  </span>
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  <button onClick={() => toggleStatus(client.id, client.status)} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider mr-4">
                    Toggle Status
                  </button>
                  <button onClick={() => handleDelete(client.id)} className="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider">
                    Delete
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
