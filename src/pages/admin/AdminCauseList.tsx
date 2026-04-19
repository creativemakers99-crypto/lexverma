import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, X, Trash, Calendar as CalendarIcon, MapPin, Watch, Edit, FileText, ChevronRight } from 'lucide-react';

export default function AdminCauseList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeDateTab, setActiveDateTab] = useState<string>('all');
  
  // Create / Add state
  const [formData, setFormData] = useState({ 
    date: '', time: '', petitioner: '', respondent: '', caseNumber: '', 
    courtName: '', courtRoom: '', advocate: '', priority: 'Normal', 
    stage: '', previousDate: '', remarks: '' 
  });

  // Edit / Next Date state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ nextDate: '', stage: '', status: '', remarks: '' });

  useEffect(() => {
    const q = query(collection(db, 'causeLists'), orderBy('date', 'asc'), orderBy('time', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'causeLists'), {
        ...formData,
        status: 'Listed',
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setFormData({ date: '', time: '', petitioner: '', respondent: '', caseNumber: '', courtName: '', courtRoom: '', advocate: '', priority: 'Normal', stage: '', previousDate: '', remarks: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to add listing");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await updateDoc(doc(db, 'causeLists', editingId), { 
        ...editData,
        updatedAt: serverTimestamp()
      });
      setEditingId(null);
    } catch(e) { console.error(e); alert("Failed to update"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this diary entry?')) return;
    try { await deleteDoc(doc(db, 'causeLists', id)); } catch(e) { console.error(e); }
  };

  // Group by date
  const grouped = items.reduce((acc: any, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold font-serif text-[var(--color-primary)]">Advocate's Diary</h3>
          <p className="text-sm text-gray-500">Manage daily cause lists, case histories, and next hearing dates.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-[var(--color-primary)] text-white px-4 py-2 font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-[var(--color-gold)] transition-colors">
          <Plus size={16} /> Add to Diary
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm rounded-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-lg text-[var(--color-primary)]">New Diary Entry</h4>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Row 1: Dates & Location */}
              <div className="space-y-4">
                <h5 className="text-xs uppercase font-bold text-[var(--color-gold)] tracking-wider">Hearing Schedule</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Hearing Date *</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Time</label>
                    <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Court Name *</label>
                    <input type="text" placeholder="e.g. Delhi High Court" required value={formData.courtName} onChange={e => setFormData({...formData, courtName: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Room / Judge</label>
                    <input type="text" placeholder="e.g. Court No. 4" value={formData.courtRoom} onChange={e => setFormData({...formData, courtRoom: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Previous Date</label>
                    <input type="date" value={formData.previousDate} onChange={e => setFormData({...formData, previousDate: e.target.value})} className="border border-gray-300 p-2 text-sm w-full text-gray-500 focus:border-[var(--color-gold)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Priority</label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="border border-gray-300 p-2 text-sm w-full bg-white focus:border-[var(--color-gold)] outline-none">
                      <option value="Normal">Normal</option>
                      <option value="High">Urgent / Final Disp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Case Details */}
              <div className="space-y-4">
                <h5 className="text-xs uppercase font-bold text-[var(--color-gold)] tracking-wider">Case Details</h5>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Petitioner / Appellant</label>
                    <input type="text" placeholder="Party Name" required value={formData.petitioner} onChange={e => setFormData({...formData, petitioner: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                  </div>
                  <div className="text-xs font-bold text-gray-400 mt-5">Vs.</div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Respondent / Def.</label>
                    <input type="text" placeholder="Party Name" required value={formData.respondent} onChange={e => setFormData({...formData, respondent: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Case No. *</label>
                    <input type="text" placeholder="e.g. CS(OS) 100/2023" required value={formData.caseNumber} onChange={e => setFormData({...formData, caseNumber: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold mb-1">Stage</label>
                    <input type="text" placeholder="e.g. Plaintiff Evidence" required value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-bold mb-1">Assigned Advocate</label>
                  <input type="text" placeholder="Name of counsel appearing" value={formData.advocate} onChange={e => setFormData({...formData, advocate: e.target.value})} className="border border-gray-300 p-2 text-sm w-full focus:border-[var(--color-gold)] outline-none" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 font-bold mb-1">Initial Brief / Notes</label>
              <textarea placeholder="Any specific instructions or context for this hearing..." value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="border border-gray-300 p-2 text-sm w-full h-16 focus:border-[var(--color-gold)] outline-none custom-scrollbar" />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button type="submit" className="bg-[var(--color-gold)] text-[var(--color-primary)] px-8 py-2.5 font-bold uppercase tracking-wider text-xs hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                Save to Diary
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Diary View Content */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-gray-200">
        <button 
          onClick={() => setActiveDateTab('all')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 ${activeDateTab === 'all' ? 'border-[var(--color-gold)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          All Listings
        </button>
        {dates.map(date => (
          <button 
            key={date}
            onClick={() => setActiveDateTab(date)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 ${activeDateTab === date ? 'border-[var(--color-gold)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {dates.length === 0 ? (
          <div className="bg-white p-12 text-center text-gray-500 border border-gray-100 rounded-sm">The diary is currently empty. Add a listing to get started.</div>
        ) : dates.filter(d => activeDateTab === 'all' || activeDateTab === d).map(date => (
          <div key={date} className="bg-transparent">
            <h4 className="font-serif text-lg font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
              <CalendarIcon size={20} className="text-[var(--color-gold)]" />
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              {grouped[date].map((item: any, index: number) => (
                <div key={item.id} className="bg-white border text-left border-gray-200 shadow-sm rounded-sm overflow-hidden flex flex-col md:flex-row">
                  
                  {/* Left Column: Core Info */}
                  <div className={`p-5 flex-1 relative ${item.priority === 'High' ? 'bg-red-50/20' : ''}`}>
                    {item.priority === 'High' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                    {!item.priority || item.priority === 'Normal' && <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-gold)]"></div>}
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Item {index + 1} • {item.courtName} <span className="text-[var(--color-gold)]">({item.courtRoom})</span></div>
                        <h5 className="text-xl font-bold text-[var(--color-primary)]">{item.petitioner} <span className="text-gray-400 font-normal italic text-base mx-1">vs</span> {item.respondent}</h5>
                        <div className="text-sm font-bold text-gray-700 mt-1">{item.caseNumber}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600 mb-2">
                          <Watch size={14} /> {item.time || 'TBD'}
                        </div>
                        <div className="text-xs uppercase tracking-wider font-bold text-gray-500">Adv: {item.advocate}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 py-3 border-t border-gray-100">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Stage</div>
                        <div className="text-sm font-medium text-gray-800 line-clamp-1" title={item.stage}>{item.stage}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Status</div>
                        <div className="text-sm font-bold text-[var(--color-primary)]">{item.status}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Previous Date</div>
                        <div className="text-sm font-medium text-gray-600">{item.previousDate ? new Date(item.previousDate).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Next Date <ChevronRight size={12} className="inline text-[var(--color-gold)]" /></div>
                        <div className="text-sm font-bold text-[var(--color-primary)]">{item.nextDate ? new Date(item.nextDate).toLocaleDateString() : 'Not Updated'}</div>
                      </div>
                    </div>
                    {item.remarks && (
                      <div className="mt-3 bg-gray-50 p-3 text-sm text-gray-600 border border-gray-100 rounded-sm">
                        <span className="font-bold text-gray-800 mr-2 text-xs uppercase">Order/Remarks:</span> 
                        {item.remarks}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Act/Edit */}
                  <div className="w-full md:w-56 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-4 shrink-0 flex flex-col justify-center">
                    {editingId === item.id ? (
                      <form onSubmit={handleUpdate} className="space-y-3">
                        <h6 className="text-xs font-bold text-[var(--color-gold)] uppercase tracking-wider mb-2">Update Diary</h6>
                        <select value={editData.status} onChange={e=>setEditData({...editData, status: e.target.value})} className="w-full text-xs p-1.5 border border-gray-300 rounded-sm">
                          <option value="Listed">Listed</option>
                          <option value="Heard">Heard</option>
                          <option value="Adjourned">Adjourned</option>
                          <option value="Passed Over">Passed Over</option>
                          <option value="Order Reserved">Order Reserved</option>
                          <option value="Disposed">Disposed / Closed</option>
                        </select>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Next Date</label>
                          <input type="date" value={editData.nextDate} onChange={e=>setEditData({...editData, nextDate: e.target.value})} className="w-full text-xs p-1.5 border border-gray-300 rounded-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Stage</label>
                          <input type="text" placeholder="Update Stage" value={editData.stage} onChange={e=>setEditData({...editData, stage: e.target.value})} className="w-full text-xs p-1.5 border border-gray-300 rounded-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Remarks/Order</label>
                          <textarea placeholder="Summary" value={editData.remarks} onChange={e=>setEditData({...editData, remarks: e.target.value})} className="w-full text-xs p-1.5 border border-gray-300 rounded-sm h-12" />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="flex-1 bg-[var(--color-primary)] text-white p-1.5 text-xs font-bold uppercase tracking-wider rounded-sm">Save</button>
                          <button type="button" onClick={()=>setEditingId(null)} className="px-2 border border-gray-300 text-gray-500 rounded-sm hover:bg-gray-200"><X size={14} /></button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button onClick={() => {
                          setEditingId(item.id);
                          setEditData({ nextDate: item.nextDate || '', stage: item.stage || '', status: item.status || 'Listed', remarks: item.remarks || '' });
                        }} className="w-full py-2 bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow-sm">
                          <Edit size={14} /> Update Hearing
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-full py-2 text-red-500 hover:bg-red-50 transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm">
                          <Trash size={14} /> Remove Entry
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
