import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const faqs = [
  {
    q: "How do I book a consultation with Adv. Rahul Verma?",
    a: "You can book a consultation by filling out the form on our Consultation Booking page, calling our office directly at +91 98765 43210, or sending us a message on WhatsApp. Our team will schedule the earliest available slot."
  },
  {
    q: "Do you handle High Court matters?",
    a: "Yes, High Court practice is one of our core specialties. We regularly handle writ petitions, criminal appeals, civil revisions, and quashing of FIRs in the Hon'ble High Court."
  },
  {
    q: "What are your consultation charges?",
    a: "Consultation charges vary depending on the complexity of the matter and the lawyer you consult with. A standard initial consultation fee is applicable. Please contact our office to get exact fee details."
  },
  {
    q: "Can I get an online/video consultation?",
    a: "Absolutely. We offer secure video and phone consultations for outstation clients or those who prefer remote meetings. You can select this option while booking."
  },
  {
    q: "Which cities do you serve?",
    a: "Our primary chamber is based in New Delhi, and we regularly practice in Delhi district courts, tribunals, and the Delhi High Court. However, for specialized or High Court matters, we represent clients across North India."
  },
  {
    q: "Will my information remain confidential?",
    a: "100%. We strictly abide by attorney-client privilege. Everything discussed during a consultation or throughout the case remains absolutely confidential."
  },
  {
    q: "How soon can you start working on my matter?",
    a: "In urgent cases such as anticipatory bail or stay orders, we can mobilize our team immediately. For regular matters, work begins as soon as the Vakalatnama is signed and the initial brief is completed."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[var(--color-offwhite)] py-20 px-4">
      <SEO title="Frequently Asked Questions" description="Answers to common questions regarding consultation fees, High Court matters, and attorney-client confidentiality at LexVerma & Associates." />
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-primary)] mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our legal services and process.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`bg-white border transition-all duration-300 ${openIndex === idx ? 'border-[var(--color-primary)] shadow-md' : 'border-gray-200'}`}
            >
              <button 
                className="w-full text-left p-6 font-serif text-xl text-[var(--color-primary)] flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold pr-4">{faq.q}</span>
                <ChevronDown className={`shrink-0 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96 pb-6 px-6 opacity-100' : 'max-h-0 px-6 opacity-0'}`}
              >
                <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4 mt-2">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-[#F5F2ED] p-10 border border-gray-200">
           <h3 className="text-2xl font-serif text-[var(--color-primary)] mb-4">Still have questions?</h3>
           <p className="text-gray-600 mb-6">Our team is ready to answer any specific legal queries regarding your matter.</p>
           <Link to="/contact" className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] transition-colors">
              Contact Us Directly
           </Link>
        </div>
      </div>
    </div>
  );
}
