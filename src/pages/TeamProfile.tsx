import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Award, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';

const teamData: Record<string, any> = {
  "rahul-verma": {
    name: "Adv. Rahul Verma",
    role: "Associate",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600",
    experience: "15+ Years",
    courts: ["Supreme Court of India", "Delhi High Court"],
    education: "LL.B (Hons), Delhi University | LL.M, King's College London",
    languages: "English, Hindi",
    focus: ["Family Law", "Criminal Defense", "Cyber Law"],
    bio: "Advocating at the highest levels of the Indian judiciary, Rahul Verma has built a distinguished career securing acquittals in high-profile criminal matters and landmark constitutional writs in the Delhi High Court. His aggressive, strategy-first approach makes him one of the most sought-after trial lawyers in the capital."
  },
  "trapti-singhal": {
    name: "Adv. Trapti Singhal",
    role: "Associate",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    experience: "10+ Years",
    courts: ["Delhi High Court", "Family Courts, NCR"],
    education: "LL.B, Campus Law Centre | Master of Social Work",
    languages: "English, Hindi",
    focus: ["Corporate Law", "Family Disputes", "Criminal Law"],
    bio: "Trapti Singhal specializes in unraveling deeply complex corporate disputes and high-net-worth family settlements. She is known for her fierce negotiation skills and her ability to reach swift out-of-court settlements, saving clients years of grueling litigation."
  },
  "sagar-modi": {
    name: "Adv. Sagar Modi",
    role: "Associate",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
    experience: "7+ Years",
    courts: ["District & Sessions Court", "NCLT"],
    education: "B.A. LL.B (Hons), National Law University",
    languages: "English, Hindi, Punjabi",
    focus: ["Civil Litigation", "Criminal Law", "Corporate Law"],
    bio: "A master of civil procedure, Sagar Modi handles the firm's critical property and financial recovery suits. His sharp eye for evidentiary loopholes has led to continuous favorable injunctions and decrees for our corporate and individual clients."
  }
}

export default function TeamProfile() {
  const { id } = useParams();
  const profile = id && teamData[id] ? teamData[id] : teamData["rahul-verma"];

  return (
    <div className="bg-[var(--color-offwhite)] py-12">
      <SEO title={`${profile.name} | ${profile.role} | LexVerma & Associates`} description={profile.bio} image={profile.image} />
      
      <div className="container mx-auto px-4 md:px-14">
        
        <Link to="/about" className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-gold)] font-bold uppercase tracking-wider text-sm mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Team
        </Link>
        
        <div className="bg-white shadow-xl flex flex-col md:flex-row overflow-hidden border-t-8 border-[var(--color-gold)]">
          <div className="md:w-1/3 shrink-0">
             <img src={profile.image} alt={profile.name} className="w-full h-full object-cover min-h-[400px] grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
          
          <div className="md:w-2/3 p-8 lg:p-12">
             <div className="border-b border-gray-100 pb-8 mb-8">
               <h1 className="text-4xl lg:text-5xl font-serif text-[var(--color-primary)] font-bold mb-2">{profile.name}</h1>
               <div className="text-[var(--color-gold)] font-bold tracking-wider uppercase text-sm mb-6">{profile.role}</div>
               
               <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                 <a href="mailto:info@lexverma.law" className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"><Mail size={16} className="text-[var(--color-gold)]"/> info@lexverma.law</a>
                 <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"><Phone size={16} className="text-[var(--color-gold)]"/> +91 98765 43210</a>
                 <span className="flex items-center gap-2"><MapPin size={16} className="text-[var(--color-gold)]"/> New Delhi, India</span>
               </div>
             </div>
             
             <div className="mb-8">
               <h2 className="text-2xl font-serif text-[var(--color-primary)] mb-4">Biography</h2>
               <p className="text-gray-600 leading-relaxed text-lg">{profile.bio}</p>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8 mb-12">
               <div>
                 <h3 className="font-serif text-[var(--color-primary)] text-xl border-b border-gray-100 pb-2 mb-4 flex items-center gap-2"><Award size={20} className="text-[var(--color-gold)]" /> Practice Areas</h3>
                 <ul className="space-y-2">
                   {profile.focus.map((item: string, i: number) => (
                     <li key={i} className="text-gray-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shrink-0"></div> {item}</li>
                   ))}
                 </ul>
               </div>
               <div>
                 <h3 className="font-serif text-[var(--color-primary)] text-xl border-b border-gray-100 pb-2 mb-4 flex items-center gap-2"><BookOpen size={20} className="text-[var(--color-gold)]" /> Credentials</h3>
                 <ul className="space-y-3">
                   <li className="text-gray-600"><span className="text-xs font-bold uppercase tracking-wide text-gray-400 block break-words">Education</span> {profile.education}</li>
                   <li className="text-gray-600"><span className="text-xs font-bold uppercase tracking-wide text-gray-400 block break-words">Courts</span> {profile.courts.join(", ")}</li>
                   <li className="text-gray-600"><span className="text-xs font-bold uppercase tracking-wide text-gray-400 block break-words">Languages</span> {profile.languages}</li>
                 </ul>
               </div>
             </div>
             
             <Link to="/booking" className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-gold)] hover:text-black text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors text-center shrink-0">
               Request Consultation with {profile.name.split(' ')[1]}
             </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}
