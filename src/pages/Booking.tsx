import { CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';
import { ai, isGeminiConfigured } from '../services/gemini';

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");

  const calendarUrl = import.meta.env.VITE_GOOGLE_CALENDAR_URL;
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleAiCategorize = async () => {
    if (!summary.trim() || !isGeminiConfigured() || !ai) return;
    
    setAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: `Analyze the following legal summary and categorize it into exactly ONE of the following precise keys: "criminal", "civil", "family", "corporate", "highcourt", "other". Output ONLY the key as a single lowercase word, nothing else. \n\nSummary: ${summary}`,
      });
      const key = response.text?.trim().toLowerCase() || "other";
      if (['criminal', 'civil', 'family', 'corporate', 'highcourt', 'other'].includes(key)) {
        setCategory(key);
      } else {
        setCategory('other');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const date = formData.get('date') as string;
    const msg = formData.get('summary') as string;
    const serviceType = formData.get('type') as string;

    // reCAPTCHA Check
    if (recaptchaSiteKey && recaptchaRef.current) {
      setLoading(true);
      const token = recaptchaRef.current.getValue();
      if (!token) {
        setError("Please complete the reCAPTCHA to verify you are human.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/verify-recaptcha', { token });
        if (!response.data.success) {
          setError("Failed reCAPTCHA verification. Please try again.");
          recaptchaRef.current.reset();
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Backend verification error. Please try again later.");
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        name,
        email,
        phone,
        message: msg,
        date: date || '',
        serviceType: serviceType || category,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      setError("An error occurred while booking your request.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-offwhite)] py-20 px-4">
        <SEO title="Booking Confirmed" />
        <div className="bg-white p-12 max-w-lg text-center shadow-xl border-t-8 border-[var(--color-gold)]">
          <CheckCircle2 size={64} className="text-[#25D366] mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-[var(--color-primary)] mb-4">Request Received</h2>
          <p className="text-gray-600 mb-8">
            Your consultation request has been submitted successfully. Our legal team will contact you shortly to confirm your appointment time and provide further details.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-[var(--color-primary)] text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-gold)] hover:text-[#050D1A] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-offwhite)]">
      <SEO title="Book Consultation" />
      <section className="bg-[var(--color-primary)] py-20 text-center text-white">
         <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Book a Legal Consultation</h1>
          <p className="text-lg text-white/70 font-light max-w-xl mx-auto">Get expert legal advice tailored to your specific matter seamlessly.</p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          {calendarUrl ? (
            <div className="bg-white shadow-2xl p-4 md:p-8 relative -mt-32">
              <div className="mb-6 flex items-center justify-center gap-3">
                <Calendar className="text-[var(--color-gold)]" size={28} />
                <h2 className="text-2xl font-serif text-[var(--color-primary)]">Live Schedule</h2>
              </div>
              <p className="text-center text-gray-500 mb-6">Pick an available time slot directly from our live calendar.</p>
              <div className="w-full h-[600px] sm:h-[800px] overflow-hidden rounded border border-gray-100">
                <iframe 
                  src={calendarUrl}
                  style={{border: 0}}
                  width="100%" 
                  height="100%" 
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-2xl p-8 md:p-12 relative -mt-32">
               <div className="mb-10 pb-6 border-b border-gray-100 flex justify-between items-start">
                 <div>
                   <h2 className="text-2xl font-serif text-[var(--color-primary)] mb-2">Consultation Details</h2>
                   <p className="text-sm text-gray-500">Please fill out the details below. We handle all information with strict attorney-client confidentiality.</p>
                 </div>
               </div>

               {error && (
                 <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                   {error}
                 </div>
               )}

               <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Full Name *</label>
                      <input type="text" required className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Phone Number *</label>
                      <input type="tel" required className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Email Address</label>
                      <input type="email" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">City / Location *</label>
                      <input type="text" required className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Case Type / Practice Area *</label>
                    <select 
                      required 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all"
                    >
                      <option value="">Select Category</option>
                      <option value="criminal">Criminal Defense / Bail</option>
                      <option value="civil">Civil & Property Dispute</option>
                      <option value="family">Family Law / Divorce</option>
                      <option value="corporate">Corporate / Legal Drafts</option>
                      <option value="highcourt">High Court Writs / Appeals</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Consultation Mode *</label>
                      <select required className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all">
                        <option value="office">In-Office Visit (Delhi)</option>
                        <option value="video">Video Conference (Zoom/Meet)</option>
                        <option value="phone">Phone Call</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2">Preferred Date</label>
                      <input type="date" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-[var(--color-charcoal)] mb-2 flex items-center justify-between">
                      <span>Brief summary of your matter (Optional)</span>
                      {summary.trim() && isGeminiConfigured() && (
                        <button 
                          type="button" 
                          onClick={handleAiCategorize}
                          disabled={aiLoading}
                          className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-gold)] bg-[var(--color-primary)] px-2 py-1 rounded hover:scale-105 transition-transform disabled:opacity-50"
                        >
                          <Sparkles size={12} /> {aiLoading ? 'Analyzing...' : 'Auto-Categorize'}
                        </button>
                      )}
                    </label>
                    <textarea 
                       value={summary}
                       onChange={(e) => setSummary(e.target.value)}
                       rows={5} 
                       className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all placeholder-gray-400" 
                       placeholder="Describe your issue. Click Auto-Categorize above to let AI automatically detect your case type..."
                    ></textarea>
                  </div>

                  {recaptchaSiteKey ? (
                    <div className="pt-2">
                       <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} />
                    </div>
                  ) : (
                    <div className="pt-2">
                       <p className="text-xs text-amber-600 bg-amber-50 p-2 border border-amber-200 rounded">
                         [Development Mode]: reCAPTCHA is disabled. Configure VITE_RECAPTCHA_SITE_KEY to enable live bot protection.
                       </p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row gap-4">
                    <button type="submit" disabled={loading} className="flex-1 bg-[var(--color-primary)] disabled:bg-gray-400 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-[#000] transition-colors shadow-lg">
                      {loading ? 'Processing...' : 'Submit Request'}
                    </button>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-[#1DA851] transition-colors shadow-lg text-center flex items-center justify-center">
                      WhatsApp Now
                    </a>
                  </div>
               </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
