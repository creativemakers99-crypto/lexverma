import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CheckCircle, Clock } from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: any[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setInquiries(results);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching inquiries:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        status: newStatus
      });
    } catch (e) {
      console.error("Error updating status:", e);
      alert("Failed to update status.");
    }
  };

  if (loading) return <div>Loading inquiries...</div>;

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Date</th>
              <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Name</th>
              <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Contact</th>
              <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Details</th>
              <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Status</th>
              <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No inquiries found.</td></tr>
            ) : inquiries.map((inq) => (
              <tr key={inq.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                  {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4 text-sm font-bold text-[var(--color-primary)]">{inq.name}</td>
                <td className="p-4 text-sm text-gray-600">
                  <div>{inq.email}</div>
                  <div>{inq.phone}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                  {inq.serviceType && <div className="font-bold text-[var(--color-gold)] text-xs uppercase mb-1">{inq.serviceType}</div>}
                  {inq.message}
                  {inq.date && <div className="mt-1 text-xs text-gray-400">Prefers: {inq.date}</div>}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    inq.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    inq.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {inq.status === 'resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {inq.status}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  {inq.status === 'pending' && (
                    <button onClick={() => markStatus(inq.id, 'contacted')} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider mr-3">
                      Mark Contacted
                    </button>
                  )}
                  {inq.status !== 'resolved' && (
                    <button onClick={() => markStatus(inq.id, 'resolved')} className="text-xs font-bold text-green-600 hover:text-green-800 uppercase tracking-wider">
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
