import { Briefcase, Send } from 'lucide-react';
import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import SEO from '../components/SEO';

export default function Career() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (recaptchaSiteKey && recaptchaRef.current) {
      setLoading(true);
      const token = recaptchaRef.current.getValue();
      if (!token) {
        setStatus({ type: 'error', message: 'Please complete the reCAPTCHA to verify you are human.' });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/verify-recaptcha', { token });
        if (!response.data.success) {
          setStatus({ type: 'error', message: 'Failed reCAPTCHA verification. Please try again.' });
          recaptchaRef.current.reset();
          setLoading(false);
          return;
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Backend verification error. Please try again later.' });
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    // Simulate form dispatch
    setTimeout(() => {
      setLoading(false);
      setStatus({ type: 'success', message: 'Your application has been submitted successfully. Our HR team will contact you if your profile matches our requirements.' });
      if (recaptchaSiteKey && recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <div>
      <SEO title="Careers & Internships | LexVerma & Associates" description="Join one of the region's leading law chambers. We are hiring associate advocates and taking applications for legal interns." />
      <section className="bg-[var(--color-primary)] py-24 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Join Our Legal Team</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">Build an impactful career at one of the region's leading law chambers.</p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-serif text-[var(--color-primary)] mb-6">Why LexVerma & Associates?</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We offer a dynamic, challenging, and highly rewarding environment for legal professionals. At our chamber, you don't just research—you get hands-on experience with complex High Court litigation, high-stakes corporate drafting, and meaningful trial advocacy.
            </p>
            
            <h3 className="text-xl font-bold mt-8 mb-4 border-b border-[var(--color-gold)] pb-2 inline-block">Current Openings</h3>
            <div className="space-y-6 mt-6">
              <div className="bg-[#F5F2ED] p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-serif font-bold text-lg text-[var(--color-primary)]">Associate Advocate</h4>
                  <span className="bg-[var(--color-primary)] text-white text-xs px-2 py-1">Full Time</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Experience: 2-4 Years | Area: Civil & High Court Matters</p>
                <p className="text-sm text-gray-500">Requires excellent drafting skills and capability to independently handle court appearances.</p>
              </div>

              <div className="bg-[#F5F2ED] p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-serif font-bold text-lg text-[var(--color-primary)]">Legal Intern</h4>
                  <span className="bg-[var(--color-gold)] text-[var(--color-primary)] font-bold text-xs px-2 py-1">Internship</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Duration: 2 Months | Application Open For: Final Year Students</p>
                <p className="text-sm text-gray-500">Focus on legal research, case law finding, and assisting in trial preparation.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-xl relative top-[-60px]">
             <div className="flex items-center gap-3 mb-6">
               <Briefcase className="text-[var(--color-gold)]" size={28} />
               <h3 className="text-2xl font-serif text-[var(--color-primary)]">Application Form</h3>
             </div>

             {status && (
                 <div className={`mb-6 p-4 text-sm border-l-4 ${status.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
                   {status.message}
                 </div>
             )}
             
             <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input type="text" className="w-full border border-gray-300 p-3 outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="Adv. Jane Doe" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input type="email" className="w-full border border-gray-300 p-3 outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="jane@email.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input type="tel" className="w-full border border-gray-300 p-3 outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="+91" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Applying For</label>
                  <select className="w-full border border-gray-300 p-3 outline-none focus:border-[var(--color-primary)] transition-colors" required>
                    <option value="">Select Position</option>
                    <option value="associate">Associate Advocate</option>
                    <option value="intern">Legal Intern</option>
                    <option value="other">Other / General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Cover Letter / Short Bio</label>
                  <textarea rows={4} className="w-full border border-gray-300 p-3 outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="Briefly describe your experience and why you want to join us..." required></textarea>
                </div>

                <div>
                   <label className="block text-sm font-semibold mb-2">Resume / CV Link (Google Drive / LinkedIn)</label>
                   <input type="url" className="w-full border border-gray-300 p-3 outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="https://" required />
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

                <button type="submit" disabled={loading} className="w-full bg-[var(--color-primary)] disabled:bg-gray-400 text-white p-4 font-bold uppercase tracking-widest hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2 mt-4">
                  {loading ? 'Submitting...' : 'Submit Application'} {!loading && <Send size={18} />}
                </button>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
}
