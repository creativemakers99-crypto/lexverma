import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { FileText, Upload, ChevronRight, CheckCircle } from 'lucide-react';

export default function ClientIntake() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    matterType: '',
    name: '',
    mobile: '',
    city: '',
    oppositeParty: '',
    urgency: 'Medium',
    existingCase: 'No',
    specific1: '',
    specific2: '',
  });

  const matterTypes = ['Criminal', 'Family', 'Civil', 'Property', 'High Court', 'Corporate', 'Consumer'];

  const getSpecificQuestions = () => {
    switch (formData.matterType) {
      case 'Criminal':
        return [
          { key: 'specific1', label: 'Is FIR registered? (Provide Police Station)' },
          { key: 'specific2', label: 'Is anticipatory or regular bail required?' }
        ];
      case 'Family':
        return [
          { key: 'specific1', label: 'Duration of marriage and number of children?' },
          { key: 'specific2', label: 'Is it a mutual or contested matter?' }
        ];
      case 'Property':
        return [
          { key: 'specific1', label: 'Are ownership papers available in your name?' },
          { key: 'specific2', label: 'Brief description of the dispute (e.g. encroachment, family partition)' }
        ];
      default:
        return [
          { key: 'specific1', label: 'Brief summary of the issue' },
          { key: 'specific2', label: 'What specific relief are you seeking?' }
        ];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'intakeForms'), {
        clientId: auth.currentUser.uid,
        ...formData,
        status: 'Under Review',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit intake form.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 text-center rounded-sm shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
        <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-2">Intake Submitted Successfully</h2>
        <p className="text-gray-600 mb-6">Our legal team is reviewing your details. We will contact you shortly to discuss the next steps.</p>
        <button onClick={() => {setStep(1); setSubmitted(false); setFormData({...formData, matterType: ''})}} className="bg-[var(--color-gold)] text-[var(--color-primary)] px-6 py-2 font-bold uppercase tracking-wider text-xs">
          Submit Another Matter
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)] mb-2">Smart Intake Form</h2>
        <p className="text-gray-500 text-sm">Please provide details about your matter to help us prepare for your consultation.</p>
      </div>

      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
        <div className="absolute left-0 top-1/2 h-0.5 bg-[var(--color-gold)] -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        {[1, 2, 3, 4].map(num => (
          <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= num ? 'bg-[var(--color-gold)] text-[var(--color-primary)]' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
            {num}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4">Step 1: Select Matter Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {matterTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setFormData({ ...formData, matterType: type }); setStep(2); }}
                    className={`p-4 border rounded-sm text-left transition-all ${formData.matterType === type ? 'border-[var(--color-gold)] bg-gold-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                     <div className="font-bold text-[var(--color-primary)] text-sm">{type}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4">Step 2: Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-gray-300 p-3 text-sm focus:border-[var(--color-gold)] focus:outline-none" />
                <input required type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="border border-gray-300 p-3 text-sm focus:border-[var(--color-gold)] focus:outline-none" />
                <input required type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="border border-gray-300 p-3 text-sm focus:border-[var(--color-gold)] focus:outline-none" />
                <input type="text" placeholder="Opposite Party Name (Optional)" value={formData.oppositeParty} onChange={e => setFormData({...formData, oppositeParty: e.target.value})} className="border border-gray-300 p-3 text-sm focus:border-[var(--color-gold)] focus:outline-none" />
                
                <div className="flex flex-col">
                  <label className="text-xs uppercase font-bold text-gray-500 mb-1">Case Urgency</label>
                  <select value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})} className="border border-gray-300 p-3 text-sm focus:border-[var(--color-gold)] focus:outline-none">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Immediate Action)</option>
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs uppercase font-bold text-gray-500 mb-1">Existing case filed?</label>
                  <select value={formData.existingCase} onChange={e => setFormData({...formData, existingCase: e.target.value})} className="border border-gray-300 p-3 text-sm focus:border-[var(--color-gold)] focus:outline-none">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4">Step 3: Matter Specifics ({formData.matterType})</h3>
              {getSpecificQuestions().map(q => (
                <div key={q.key} className="flex flex-col">
                  <label className="text-sm font-bold text-[var(--color-primary)] mb-2">{q.label}</label>
                  <textarea 
                    required 
                    className="border border-gray-300 p-3 text-sm focus:border-[var(--color-gold)] focus:outline-none min-h-[100px]"
                    value={(formData as any)[q.key]}
                    onChange={e => setFormData({...formData, [q.key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-2">Step 4: Upload Documents (Optional)</h3>
              <p className="text-sm text-gray-500 mb-4">Please note: You can upload initial documents such as FIR, Notices, or Order Copies to assist in our review. For highly confidential documents, you may use the eVault or share them during consultation.</p>
              
              <div className="border-2 border-dashed border-gray-300 p-8 text-center bg-gray-50 rounded-sm">
                <Upload className="mx-auto text-gray-400 mb-4" size={32} />
                <p className="text-sm font-bold text-gray-600 mb-1">Click to upload or drag files here</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG up to 10MB each</p>
                <input type="file" multiple className="hidden" id="intake-docs" />
                <label htmlFor="intake-docs" className="mt-4 inline-block bg-white border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-gray-50">Browse Files</label>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 border border-gray-300 text-sm font-bold uppercase tracking-wider hover:bg-gray-50">Back</button>
            ) : <div></div>}
            
            {step < 4 ? (
              <button type="submit" disabled={step === 1 && !formData.matterType} className="bg-[var(--color-primary)] text-white px-6 py-2 font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] disabled:opacity-50">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="bg-[var(--color-gold)] text-[var(--color-primary)] px-8 py-2 font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Form'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
