import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, auth, storage } from '../../lib/firebase';
import { FileText, Download, Trash, UploadCloud, File } from 'lucide-react';

export default function ClientDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    if (!auth.currentUser) return;
    try {
      const q = query(collection(db, 'documents'), where('clientId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadWithCategory = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    try {
      // 1. Upload to Storage
      const storageRef = ref(storage, `documents/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      // 2. Save metadata to Firestore
      await addDoc(collection(db, 'documents'), {
        clientId: auth.currentUser.uid,
        name: file.name,
        url: url,
        path: snapshot.ref.fullPath,
        size: file.size,
        type: file.type,
        uploadedBy: 'client',
        category: category,
        createdAt: serverTimestamp()
      });

      // Refresh
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (docObj: any) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      // delete from storage
      if (docObj.path) {
        await deleteObject(ref(storage, docObj.path));
      }
      // delete from firestore
      await deleteDoc(doc(db, 'documents', docObj.id));
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Error deleting document.");
    }
  };

  if (loading) return <div>Loading documents...</div>;

  const categories = ['All', 'Court Orders', 'FIR / Complaints', 'Agreements', 'Identity Proof', 'Evidence', 'Other'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDocs = selectedCategory === 'All' ? documents : documents.filter(d => (d.category || 'Other') === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-1">Documents eVault</h2>
          <p className="text-gray-500 text-sm">Secure storage for your case files, evidence, and orders.</p>
        </div>
        
        <div className="flex items-center gap-2 relative">
          <select 
            value={selectedCategory === 'All' ? 'Other' : selectedCategory}
            onChange={(e) => {
              if (selectedCategory !== 'All') {
                setSelectedCategory(e.target.value);
              }
              // To pass to upload
            }}
            id="upload-cat"
            className="border border-gray-300 p-2 text-sm text-gray-600 bg-white"
          >
            {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="file" id="upload-doc" className="sr-only" onChange={(e) => {
             // quick hack to pass category to upload
             const catObj = document.getElementById('upload-cat') as HTMLSelectElement;
             handleUploadWithCategory(e, catObj ? catObj.value : 'Other');
          }} disabled={uploading} />
          <label htmlFor="upload-doc" className={`bg-[var(--color-primary)] text-white px-4 py-2 font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer transition-colors ${uploading ? 'opacity-70' : 'hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)]'}`}>
             {uploading ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div> : <UploadCloud size={16} />}
             {uploading ? 'Uploading...' : 'Upload File'}
          </label>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap rounded-sm transition-colors ${selectedCategory === c ? 'bg-[var(--color-gold)] text-[var(--color-primary)]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">File Name</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold">Source</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No documents found in this folder.</td></tr>
            ) : filteredDocs.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <File size={16} />
                    </div>
                    <div className="font-bold text-[var(--color-primary)] truncate max-w-[150px] sm:max-w-[200px]" title={d.name}>{d.name}</div>
                  </div>
                </td>
                <td className="p-4 text-sm font-bold text-gray-600">
                  {d.category || 'Other'}
                </td>
                <td className="p-4 text-sm text-gray-600">
                   {d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString() : 'Just now'}
                </td>
                <td className="p-4">
                   <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm ${d.uploadedBy === 'client' ? 'bg-gray-100 text-gray-600' : 'bg-gold-50 text-[var(--color-gold)] border border-[var(--color-gold)]'}`}>
                     {d.uploadedBy === 'client' ? 'You' : 'Law Firm'}
                   </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 transition-colors rounded-sm inline-flex">
                    <Download size={16} />
                  </a>
                  {d.uploadedBy === 'client' && (
                    <button onClick={() => handleDelete(d)} className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded-sm inline-flex">
                      <Trash size={16} />
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
