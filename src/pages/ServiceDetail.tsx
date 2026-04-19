import { useParams, Link } from 'react-router-dom';
import { Shield, ArrowRight, Gavel, FileText, Component, Users, Building, MapPin, CheckCircle, Scale } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'motion/react';

// Shared data source for all generated service pages
const serviceData: Record<string, any> = {
  "criminal-lawyer": {
    title: "Expert Criminal Lawyer",
    shortTitle: "Criminal Law",
    icon: <Gavel size={40} />,
    desc: "Aggressive defense strategies to protect your liberty and rights.",
    longDesc: "Facing criminal charges can be the most frightening experience of your life. A criminal conviction can lead to significant jail time, heavy fines, and a permanent criminal record. You need an aggressive, experienced criminal defense advocate who understands the system.",
    expertise: ["Anticipatory & Regular Bail", "Trial Defense", "FIR Quashing", "Cheque Bounce cases (Sec 138 NI Act)", "Economic Offenses", "Cyber Crime"],
    whyContent: "With a track record of securing bail and acquittals in highly complex cases, we bring strategic courtroom advocacy to protect your constitutional rights."
  },
  "family-lawyer": {
    title: "Premium Family & Divorce Lawyer",
    shortTitle: "Family Law",
    icon: <Users size={40} />,
    desc: "Compassionate yet firm representation in complex family dynamics and disputes.",
    longDesc: "Family law matters are highly sensitive and emotionally draining. Whether it's a contested divorce, a battle for child custody, or claiming maintenance, you need an empathetic yet fierce advocate who can secure what is rightfully yours.",
    expertise: ["Contested & Mutual Consent Divorce", "Child Custody & Visitation", "Alimony & Maintenance Claims", "Domestic Violence Protection", "Restitution of Conjugal Rights", "Marriage Registration"],
    whyContent: "We focus on quick alternative dispute resolutions and mediation where possible, but we are fully prepared to litigate aggressively when your rights are threatened."
  },
  "civil-property-lawyer": {
    title: "Civil & Property Dispute Lawyer",
    shortTitle: "Civil & Property Law",
    icon: <Scale size={40} />,
    desc: "Thorough legal action to recover dues, protect property, and enforce rights.",
    longDesc: "Civil litigation covers a wide array of disputes regarding property, breach of contract, and monetary recovery. These cases require meticulous documentation and a deep understanding of civil procedure codes to secure favorable injunctions and decrees.",
    expertise: ["Property & Land Disputes", "Partition Suits", "Injunctions & Stays", "Recovery Suits for Dues", "Specific Performance of Contract", "Consumer Protection Cases"],
    whyContent: "Our meticulous attention to detail in drafting plaints and compiling evidence ensures that your property and financial interests are strongly secured in court."
  },
  "high-court-advocate": {
    title: "High Court Advocate",
    shortTitle: "High Court Matters",
    icon: <Building size={40} />,
    desc: "Expert appellate litigation and writ petitions before the Hon'ble High Court.",
    longDesc: "Litigating at the High Court level requires sophisticated legal acumen, precedent research, and exceptional oral advocacy skills. We handle complex constitutional, civil, and criminal matters before the High Court.",
    expertise: ["Writ Petitions (Art. 226/227)", "Criminal & Civil Appeals", "Revision Petitions", "Quashing of FIRs", "Stay Orders against lower courts", "Bail in High Court"],
    whyContent: "Led by extremely experienced High Court practitioners, we have a proven track record of overturning adverse lower court judgments and securing rapid interim relief through Writs."
  }
};

export default function ServiceDetail() {
  const { serviceId, city } = useParams();
  
  // Clean up the URL params to match our database or default down
  let key = "criminal-lawyer"; // Default
  if (serviceId && serviceData[serviceId]) {
    key = serviceId;
  }
  
  const data = serviceData[key];
  
  // If city is passed, we dynamically inject it for Local SEO
  const cityName = city ? city.charAt(0).toUpperCase() + city.slice(1).replace("-", " ") : "Delhi / NCR";
  
  const pageTitle = city ? `${data.title} in ${cityName}` : data.title;
  const pageDesc = `Looking for a top ${data.shortTitle.toLowerCase()} advocate in ${cityName}? LexVerma & Associates offers premium legal representation for ${data.shortTitle}.`;

  return (
    <div className="bg-[var(--color-offwhite)]">
      <SEO title={`${pageTitle} | LexVerma & Associates`} description={pageDesc} />
      
      {/* Dynamic Hero */}
      <section className="bg-[var(--color-primary)] py-20 text-white relative">
        <div className="container mx-auto px-4 md:px-14 relative z-10">
          <div className="max-w-3xl">
             <div className="text-[var(--color-gold)] mb-6 flex items-center gap-2">
                 {data.icon} 
                 {city && <span className="flex items-center text-sm ml-4 border border-[var(--color-gold)] px-3 py-1 rounded-full uppercase tracking-wider"><MapPin size={14} className="mr-1"/> {cityName}</span>}
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">{pageTitle}</h1>
             <p className="text-xl text-white/80 font-light mb-8">{data.desc}</p>
             <div className="flex gap-4">
                <Link to="/booking" className="bg-[var(--color-gold)] text-[var(--color-primary)] px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors">
                  Book Consultation
                </Link>
                <a href="tel:+919876543210" className="border border-white hover:bg-white hover:text-[var(--color-primary)] text-white px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors">
                  Call Now
                </a>
             </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-14">
          <div className="grid lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2">
               <h2 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-6">About {data.shortTitle} Matters</h2>
               <p className="text-gray-600 leading-relaxed text-lg mb-10">{data.longDesc}</p>
               
               <div className="bg-white p-8 border-l-4 border-[var(--color-gold)] shadow-xl mb-12">
                  <h3 className="text-2xl font-serif text-[var(--color-primary)] mb-4">Why Choose Us?</h3>
                  <p className="text-gray-600 leading-relaxed">{data.whyContent}</p>
               </div>
               
               <h3 className="text-2xl font-serif text-[var(--color-primary)] mb-6">Our Core Expertise</h3>
               <div className="grid md:grid-cols-2 gap-4">
                 {data.expertise.map((item: string, i: number) => (
                   <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-100 hover:border-[var(--color-gold)] transition-colors">
                     <CheckCircle className="text-[var(--color-gold)] mt-1 shrink-0" size={20} />
                     <span className="font-bold text-[var(--color-primary)]">{item}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Sidebar for Lead Gen */}
            <div className="space-y-8">
               <div className="bg-[var(--color-primary)] text-white p-8">
                  <h3 className="text-2xl font-serif mb-4">Get Immediate Legal Analysis</h3>
                  <p className="text-sm text-white/70 mb-6">Let our AI system instantly evaluate your {data.shortTitle.toLowerCase()} scenario to provide strategic insights before you speak with an advocate.</p>
                  <Link to="/ai-evaluation" className="block text-center bg-[var(--color-gold)] text-[var(--color-primary)] font-bold uppercase tracking-wider py-4 w-full hover:bg-white transition-colors">
                    Start Free AI Case Eval
                  </Link>
               </div>

               <div className="bg-white border border-gray-200 p-8">
                  <h3 className="text-xl font-serif text-[var(--color-primary)] mb-4">Download Legal Checklist</h3>
                  <p className="text-sm text-gray-500 mb-6">Get our comprehensive preparation guide for {data.shortTitle} matters.</p>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Guide will be emailed shortly.'); }}>
                    <input type="email" placeholder="Your Email Address" required className="w-full border border-gray-300 p-3 outline-none focus:border-[var(--color-primary)]" />
                    <button type="submit" className="w-full bg-[var(--color-primary)] text-white font-bold uppercase tracking-wider py-3 hover:bg-[var(--color-gold)] hover:text-[#000] transition-colors text-sm">
                      Send Me The PDF
                    </button>
                  </form>
               </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
