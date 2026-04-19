import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_MAPS_PLACE_ID;

  // Use Maps Embed API if key is available, else fallback to standard Maps URL query
  const mapUrl = import.meta.env.GOOGLE_PLACES_API_KEY 
    ? `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.GOOGLE_PLACES_API_KEY}&q=place_id:${placeId}`
    : "https://maps.google.com/maps?q=High+Court+New+Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const serviceType = formData.get('service') as string;

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
    try {
      await addDoc(collection(db, 'inquiries'), {
        name,
        email,
        phone,
        message,
        date: '',
        serviceType: serviceType || 'General Inquiry',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setStatus({ type: 'success', message: 'Your message has been sent successfully. We will contact you soon.' });
      if (recaptchaSiteKey && recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      form.reset();
    } catch (e) {
      console.error(e);
      setStatus({ type: 'error', message: 'An error occurred while sending your message.' });
    }
    setLoading(false);
  };

  return (
    <div>
      <SEO title="Contact Us" description="Get in touch with LexVerma & Associates legal team for inquiries or chamber directions." />
      <section className="bg-[var(--color-primary)] py-24 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">Get in touch with our legal team for immediate assistance.</p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-serif text-[var(--color-primary)] mb-8">Chamber Locations & Details</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F5F2ED] rounded-full flex items-center justify-center text-[var(--color-gold)] shrink-0">
                    <MapPin />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Head Office</h3>
                    <p className="text-gray-600">123 Legal Tower, High Court Road<br/>New Delhi, Delhi 110001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F5F2ED] rounded-full flex items-center justify-center text-[var(--color-gold)] shrink-0">
                    <Phone />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone / WhatsApp</h3>
                    <a href="tel:+91xxxxxxxx02" className="text-gray-600 hover:text-[var(--color-gold)]">+91xxxxxxxx02</a><br/>
                    <a href="tel:+91112345678" className="text-gray-600 hover:text-[var(--color-gold)]">011-2345678</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F5F2ED] rounded-full flex items-center justify-center text-[var(--color-gold)] shrink-0">
                    <Mail />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email Addresses</h3>
                    <a href="mailto:info@lexverma.law" className="text-gray-600 hover:text-[var(--color-gold)]">info@lexverma.law</a><br/>
                    <a href="mailto:legal@lexverma.law" className="text-gray-600 hover:text-[var(--color-gold)]">legal@lexverma.law</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F5F2ED] rounded-full flex items-center justify-center text-[var(--color-gold)] shrink-0">
                    <Clock />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Working Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 10:00 AM - 7:00 PM<br/>Sundays: By prior appointment only</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder -> Real Integration */}
              <div className="mt-10 h-64 w-full bg-gray-100 overflow-hidden relative">
                <iframe 
                  src={mapUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Law Firm Location Map"
                ></iframe>
              </div>
            </div>

            {/* General Contact Form */}
            <div className="bg-[#F5F2ED] p-10 shadow-sm border-t-4 border-[var(--color-primary)]">
              <h2 className="text-2xl font-serif text-[var(--color-primary)] mb-2">Send us a message</h2>
              <p className="text-sm text-gray-600 mb-8">For consultation, please use our Book Consultation page. Use this form for general inquiries.</p>

              {status && (
                 <div className={`mb-6 p-4 text-sm border-l-4 ${status.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
                   {status.message}
                 </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                  <input type="text" className="w-full border-b border-gray-400 bg-transparent p-2 outline-none focus:border-[var(--color-primary)] transition-colors" required />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
                    <input type="email" className="w-full border-b border-gray-400 bg-transparent p-2 outline-none focus:border-[var(--color-primary)] transition-colors" required />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Subject</label>
                    <input type="text" className="w-full border-b border-gray-400 bg-transparent p-2 outline-none focus:border-[var(--color-primary)] transition-colors" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Your Message</label>
                  <textarea rows={4} className="w-full border-b border-gray-400 bg-transparent p-2 outline-none focus:border-[var(--color-primary)] transition-colors leading-relaxed" required></textarea>
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

                <button type="submit" disabled={loading} className="bg-[var(--color-primary)] disabled:bg-gray-400 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] transition-colors mt-4">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
