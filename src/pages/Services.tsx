import { motion } from 'motion/react';
import { Component, Users, Gavel, FileText, Scale, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const servicesList = [
  {
    id: "family",
    title: "Family Law",
    icon: <Users size={40} />,
    description: "Compassionate yet firm representation in complex family dynamics and disputes.",
    process: ["Initial Consultation", "Mediation & Negotiation", "Filing Petitions", "Court Representation", "Final Decree"],
    items: ["Mutual & Contested Divorce", "Child Custody & Visitation", "Alimony & Maintenance", "Domestic Violence", "Marriage Registration"]
  },
  {
    id: "criminal",
    title: "Criminal Law",
    icon: <Gavel size={40} />,
    description: "Aggressive defense strategies to protect your liberty and rights.",
    process: ["Case Analysis", "Bail Application", "Evidence Gathering", "Trial Defense", "Appeals"],
    items: ["Anticipatory & Regular Bail", "Criminal Trial Defense", "FIR Quashing", "Cheque Bounce (138 NI Act)", "Cyber Crime"]
  },
  {
    id: "civil",
    title: "Civil Law",
    icon: <Scale size={40} />,
    description: "Thorough legal action to recover dues, protect property, and enforce rights.",
    process: ["Legal Notice", "Drafting Plaint", "Filing Suit", "Evidence & Arguments", "Execution of Decree"],
    items: ["Property & Asset Disputes", "Recovery Suits", "Injunctions & Stays", "Partition Suits", "Consumer Protection"]
  },
  {
    id: "high-court",
    title: "High Court Matters",
    icon: <Building size={40} />,
    description: "Expert appellate litigation and writ petitions before the Hon'ble High Court.",
    process: ["Briefing", "Drafting Writ/Appeal", "Listing", "Arguments", "Order/Judgment"],
    items: ["Writ Petitions (Art. 226/227)", "Criminal & Civil Appeals", "Revision Petitions", "Stay Orders", "Bail in High Court"]
  },
  {
    id: "corporate",
    title: "Corporate Law",
    icon: <Component size={40} />,
    description: "Comprehensive legal compliance and dispute resolution for modern businesses.",
    process: ["Due Diligence", "Drafting", "Review & Negotiation", "Compliance", "Litigation/Arbitration"],
    items: ["Contract Drafting & Review", "Company Registration", "Legal Notices", "Arbitration", "Startup Legal Compliance"]
  },
  {
    id: "documentation",
    title: "Documentation",
    icon: <FileText size={40} />,
    description: "Precision-drafted legal documents ensuring airtight security and enforceability.",
    process: ["Requirement Gathering", "Drafting", "Review", "Execution", "Registration"],
    items: ["Sale Deeds", "Lease & Rent Agreements", "Power of Attorney", "Affidavits", "Wills & Trusts"]
  }
];

export default function Services() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-[var(--color-offwhite)]">
       <SEO title="Legal Services & Practice Areas | LexVerma & Associates" description="Expert legal services in Criminal Law, Family Law, Civil Law, High Court Matters, Corporate Law, and Legal Documentation." />
       {/* Banner */}
       <section className="bg-[var(--color-primary)] py-24 text-center text-white relative">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Our Legal Services</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">Comprehensive expertise across major legal domains.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 py-20">
        {servicesList.map((service, index) => (
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            id={service.id} 
            key={service.id} 
            className={`flex flex-col lg:flex-row gap-12 items-start py-12 mb-12 border-b border-gray-200 ${index === servicesList.length - 1 ? 'border-none mb-0' : ''}`}
          >
            <div className="w-full lg:w-1/3">
              <div className="text-[var(--color-gold)] mb-6 bg-[var(--color-primary)] inline-block p-4 rounded-sm">
                {service.icon}
              </div>
              <h2 className="text-3xl font-serif text-[var(--color-primary)] mb-4">{service.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <Link to="/booking" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold hover:text-[var(--color-gold)] transition-colors uppercase tracking-wider text-sm">
                Consult Now <ArrowRight size={18} />
              </Link>
            </div>

            <div className="w-full lg:w-2/3 grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 shadow-sm">
                <h3 className="font-serif text-xl border-b border-gray-100 pb-3 mb-4 text-[var(--color-primary)]">Areas of Practice</h3>
                <ul className="space-y-3">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[var(--color-gold)] rounded-full mt-2 shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-[#F5F2ED] p-8 shadow-sm">
                <h3 className="font-serif text-xl border-b border-gray-200 pb-3 mb-4 text-[var(--color-primary)]">Our Approach</h3>
                <ol className="space-y-4">
                  {service.process.map((step, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-[var(--color-gold)] font-bold font-serif text-xl opacity-50">0{i+1}</span>
                      <span className="font-medium text-[var(--color-primary)]">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
