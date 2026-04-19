import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Trash, CheckSquare, Clock, AlertCircle, X, Search } from 'lucide-react';

export default function AdminTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', assignedTo: '', priority: 'Normal', deadline: '', linkedCase: '', notes: '', status: 'New Tasks' });

  const columns = ['New Tasks', 'In Progress', 'Waiting', 'Completed'];

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setFormData({ title: '', assignedTo: '', priority: 'Normal', deadline: '', linkedCase: '', notes: '', status: 'New Tasks' });
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try { await deleteDoc(doc(db, 'tasks', id)); } catch(e) { console.error(e); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold font-serif text-[var(--color-primary)]">Task Management</h3>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-[var(--color-primary)] text-white px-4 py-2 font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-[var(--color-gold)] transition-colors">
          <Plus size={16} /> Assign Task
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm mb-6 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Create New Task</h4>
            <button onClick={() => setIsAdding(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="text" placeholder="Task Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border p-2 w-full text-sm" />
              <input type="text" placeholder="Assign To (Name or Role)" required value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} className="border p-2 w-full text-sm" />
              <input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="border p-2 w-full text-sm text-gray-500" />
              
              <div className="flex flex-col">
                <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="border p-2 w-full text-sm">
                  <option value="Normal">Normal Priority</option>
                  <option value="Urgent">Urgent Priority</option>
                </select>
              </div>
              <input type="text" placeholder="Linked Case (Optional)" value={formData.linkedCase} onChange={e => setFormData({...formData, linkedCase: e.target.value})} className="border p-2 w-full text-sm" />
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="border p-2 w-full text-sm">
                 {columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea placeholder="Additional Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="border p-2 w-full text-sm h-16" />
            <div className="flex justify-end">
              <button type="submit" className="bg-[var(--color-gold)] text-[var(--color-primary)] px-6 py-2 font-bold uppercase tracking-wider text-xs">Add Task</button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map(status => {
          const colTasks = tasks.filter(t => t.status === status);
          return (
            <div key={status} className="bg-gray-50 flex-1 min-w-[300px] border border-gray-200 rounded-sm flex flex-col h-full shrink-0">
              <div className="bg-white p-3 border-b border-gray-200 font-bold text-[var(--color-primary)] uppercase tracking-wider text-xs flex justify-between items-center shadow-sm">
                <span>{status}</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">{colTasks.length}</span>
              </div>
              <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {colTasks.map(task => (
                  <div key={task.id} className={`bg-white p-4 rounded-sm shadow-sm border-l-4 ${task.priority === 'Urgent' ? 'border-red-500' : 'border-blue-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                       <h5 className="font-bold text-sm text-[var(--color-primary)]">{task.title}</h5>
                       <button onClick={() => handleDelete(task.id)} className="text-gray-400 hover:text-red-500"><Trash size={14} /></button>
                    </div>
                    {task.linkedCase && <div className="text-xs text-[var(--color-gold)] font-bold mb-2 break-all">{task.linkedCase}</div>}
                    <div className="text-xs text-gray-500 mb-3 line-clamp-2">{task.notes}</div>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-sm">
                        <CheckSquare size={12} /> {task.assignedTo}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                        <Clock size={12} className={new Date(task.deadline) < new Date() && task.status !== 'Completed' ? 'text-red-500' : ''} /> 
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <select 
                        value={task.status} 
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-xs border p-1 w-full bg-gray-50 text-gray-600 outline-none hover:bg-white transition-colors"
                      >
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
