import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { User, Award, BookOpen, Scale } from 'lucide-react';
import SEO from '../components/SEO';

const advocates = [
  { 
    id: "rahul-verma", 
    name: "Adv. Rahul Verma", 
    role: "Associate", 
    type: "Family, Criminal, and Cyber cases", 
    focus: ["Family Law", "Criminal Defense", "Cyber Law"],
    img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    id: "trapti-singhal", 
    name: "Adv. Trapti Singhal", 
    role: "Associate", 
    type: "Corporate, Family and Criminal laws", 
    focus: ["Corporate Law", "Family Disputes", "Criminal Law"],
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    id: "sagar-modi", 
    name: "Adv. Sagar Modi", 
    role: "Associate", 
    type: "Civil, criminal and corporate laws", 
    focus: ["Civil Litigation", "Criminal Law", "Corporate Law"],
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600" 
  }
];

export default function Advocates() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[var(--color-offwhite)]">
      <SEO title="Our Advocates | Expert Legal Team | LexVerma & Associates" description="Meet our team of highly qualified and experienced advocates specializing in High Court, Criminal, Civil, and Family law." />
      
      {/* Banner */}
      <section className="bg-[var(--color-primary)] py-20 text-center text-white relative">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Legal Experts</h1>
          <p className="text-lg text-gray-300 font-light max-w-2xl mx-auto uppercase tracking-widest border-t border-b border-white/10 py-3 mt-4">Commanding Presence in Every Courtroom</p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-14">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {advocates.map((advocate, i) => (
              <motion.div 
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="bg-white group overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row"
              >
                <div className="md:w-2/5 shrink-0 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                  <img src={advocate.img} alt={advocate.name} className="w-full h-full object-cover min-h-[300px] group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                     <Link to={`/team/${advocate.id}`} className="text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2">View Full Bio <Award size={14} /></Link>
                  </div>
                </div>
                <div className="p-8 md:w-3/5 flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-2xl font-serif text-[var(--color-primary)] font-bold mb-1 group-hover:text-[var(--color-gold)] transition-colors">{advocate.name}</h2>
                    <p className="text-[var(--color-gold)] font-bold uppercase tracking-wider text-xs">{advocate.role}</p>
                  </div>
                  
                  <div className="space-y-4 mb-8 flex-grow">
                     <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Scale size={16} className="text-[var(--color-gold)]" />
                        <span><strong>Expertise:</strong> {advocate.type}</span>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-4">
                        {advocate.focus.map((f, idx) => (
                          <span key={idx} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 uppercase font-bold tracking-tighter">{f}</span>
                        ))}
                     </div>
                  </div>
                  
                  <Link to={`/team/${advocate.id}`} className="inline-block border-b-2 border-[var(--color-gold)] text-[var(--color-primary)] font-bold uppercase tracking-widest text-xs py-1 hover:text-[var(--color-gold)] transition-colors w-max">
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="bg-[var(--color-primary)] py-16 text-center text-white italic border-t-8 border-[var(--color-gold)] overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative">
          <div className="absolute top-0 left-0 text-[120px] opacity-10 font-serif -translate-y-12">"</div>
          <p className="text-xl md:text-2xl font-serif leading-relaxed relative z-10">
            "Legal counsel is not just about citing statutes, it is about crafting strategic outcomes that protect our clients' liberty and legacy."
          </p>
          <div className="mt-8 font-serif text-[var(--color-gold)] font-bold tracking-widest text-sm">— LEXVERMA & ASSOCIATES ADVISORY BOARD</div>
        </div>
      </section>
    </div>
  );
}
