import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Scale, Users, FileText, Gavel, CheckCircle, Shield, MapPin, Star, Building2, ChevronDown, ChevronRight, ChevronLeft, Briefcase, ShoppingCart, Landmark, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useState, useEffect } from 'react';

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1920&q=80",
    headingPart1: "Trusted Legal Experts ",
    headingPart2: "Protecting Your Rights.",
    desc: "Criminal, Civil, Family, Property & High Court Representation. Dedicated advocates fighting for justice with integrity and results."
  },
  {
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1920&q=80",
    headingPart1: "Unyielding Defense ",
    headingPart2: "In Complex Matters.",
    desc: "Aggressive and strategic representation in high-stakes litigation. We stand by you when your future is on the line."
  },
  {
    image: "https://images.unsplash.com/photo-1505664159854-232cb979f42b?auto=format&fit=crop&w=1920&q=80",
    headingPart1: "Corporate & Civil Law ",
    headingPart2: "Unmatched Expertise.",
    desc: "Providing comprehensive compliance, advisory, and dispute resolution services tailored for businesses and individuals."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex flex-col">
      <SEO />
      {/* HERO SECTION */}
      <section className="relative h-[650px] md:h-[700px] flex items-center overflow-hidden bg-[var(--color-primary)]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(11,31,58,0.92) 0%, rgba(11,31,58,0.6) 40%, rgba(11,31,58,0.7) 100%), linear-gradient(to bottom, rgba(11,31,58,0.3) 0%, rgba(0,0,0,0) 20%, rgba(11,31,58,0.85) 100%), url('${heroSlides[currentSlide].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>
        
        <div className="container mx-auto z-10 text-white relative px-4 md:px-14 mt-16 md:mt-24 pointer-events-none">
          <div className="max-w-[750px] relative pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hero-content"
              >
                <h1 className="font-serif text-[42px] md:text-[56px] leading-[1.1] mb-[20px] font-bold">
                  {heroSlides[currentSlide].headingPart1} <br/><span className="text-[var(--color-gold)]">{heroSlides[currentSlide].headingPart2}</span>
                </h1>
                <p className="text-[18px] text-white/80 mb-[30px] leading-[1.6] border-l-[3px] border-[var(--color-gold)] pl-[20px] max-w-2xl drop-shadow-lg">
                  {heroSlides[currentSlide].desc}
                </p>
              </motion.div>
            </AnimatePresence>
              
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-wrap gap-[15px]">
              <motion.div variants={fadeInUp}>
                <Link to="/booking" className="bg-[var(--color-gold)] text-[var(--color-primary)] px-6 py-3.5 text-center font-bold uppercase tracking-[1px] text-[13px] hover:bg-white transition-colors duration-300 inline-block">
                  Book Consultation
                </Link>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <a href="tel:+91xxxxxxxx02" className="bg-[var(--color-primary)] border border-white/20 text-white px-6 py-3.5 text-center font-bold uppercase tracking-[1px] text-[13px] hover:bg-white hover:text-[var(--color-primary)] transition-colors duration-300 inline-block">
                  Call Now
                </a>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <a href="https://wa.me/91xxxxxxxx02" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-6 py-3.5 text-center font-bold uppercase tracking-[1px] text-[13px] hover:bg-[#1DA851] transition-colors duration-300 flex items-center justify-center gap-2 inline-flex">
                  WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-12 md:bottom-20 left-4 md:left-24 z-20 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === idx ? 'w-8 bg-[var(--color-gold)]' : 'w-4 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="relative z-20 px-4 md:px-14">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="container mx-auto">
          <div className="bg-white -mt-[60px] md:-mt-[80px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] rounded-[4px] border-t-4 border-[var(--color-gold)] relative overflow-hidden flex flex-col">
            
            <div className="relative z-10 text-center py-8 px-4 bg-[#F9F8F6] border-b border-[#eee]">
              <h2 className="text-[28px] md:text-[32px] font-serif font-bold text-[var(--color-primary)] mb-1">What Our Clients Say</h2>
              <p className="text-[var(--color-gold)] uppercase tracking-widest text-[11px] font-bold">Unwavering commitment. Proven results.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 relative z-10 w-full">
              <div className="p-[30px] md:p-[40px] text-center md:border-r border-[#eee] flex flex-col justify-center items-center group">
                <Users size={32} className="text-[var(--color-gold)] mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <span className="block font-serif text-[42px] md:text-[48px] font-bold text-[var(--color-primary)] leading-none mb-2">1,200+</span>
                <span className="text-[12px] font-bold uppercase text-gray-500 tracking-[2px]">Google Reviews</span>
              </div>
              
              <div className="p-[30px] md:p-[40px] text-center md:border-r border-[#eee] flex flex-col justify-center items-center group">
                <Star size={32} className="text-[var(--color-gold)] mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <span className="block font-serif text-[42px] md:text-[48px] font-bold text-[var(--color-primary)] leading-none mb-2">4.9/5</span>
                <span className="flex justify-center text-[var(--color-gold)] my-1 gap-1">
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                </span>
                <span className="text-[12px] font-bold uppercase text-gray-500 tracking-[2px] mt-1">Average Rating</span>
              </div>
              
              <div className="p-[30px] md:p-[40px] text-center flex flex-col justify-center items-center group">
                <Award size={32} className="text-[var(--color-gold)] mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <span className="block font-serif text-[42px] md:text-[48px] font-bold text-[var(--color-primary)] leading-none mb-2">98%</span>
                <span className="text-[12px] font-bold uppercase text-gray-500 tracking-[2px] mt-1">Success Rate</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Practice Areas */}
      <section className="bg-[var(--color-offwhite)] py-[80px] px-4 md:px-14 flex-grow">
        <div className="container mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)] mb-[10px]">Areas of Practice</h2>
             <div className="w-[60px] h-[3px] bg-[var(--color-gold)] mx-auto mt-[15px]"></div>
             <p className="text-gray-500 max-w-2xl mx-auto mt-6">Comprehensive legal representation tailored to protect your rights across multiple jurisdictions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[25px]">
            {[
              { title: "Criminal Law", icon: <Gavel size={32} strokeWidth={1.5} />, link: "/services/criminal-lawyer", items: "Bail, Trial Defense, Appeals" },
              { title: "Family Law", icon: <Users size={32} strokeWidth={1.5} />, link: "/services/family-lawyer", items: "Divorce, Custody, Alimony" },
              { title: "Civil Law", icon: <Landmark size={32} strokeWidth={1.5} />, link: "/services/civil-property-lawyer", items: "Recovery Suits, Injunctions" },
              { title: "Property Matters", icon: <Building2 size={32} strokeWidth={1.5} />, link: "/services/civil-property-lawyer", items: "Land Disputes, Partition" },
              { title: "High Court Matters", icon: <Shield size={32} strokeWidth={1.5} />, link: "/services/high-court-advocate", items: "Writ Petitions, Revisions", premier: true },
              { title: "Corporate Advisory", icon: <Briefcase size={32} strokeWidth={1.5} />, link: "/services", items: "Contracts, Compliance" },
              { title: "Consumer Cases", icon: <ShoppingCart size={32} strokeWidth={1.5} />, link: "/services", items: "Consumer Protection" },
              { title: "Documentation", icon: <FileText size={32} strokeWidth={1.5} />, link: "/services", items: "Deeds, Agreements, Wills" }
            ].map((service, i) => (
              <Link to={service.link} key={i}>
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                  className="bg-white border-t-4 border-t-transparent border-gray-100 shadow-sm p-[30px] transition-all duration-300 hover:border-t-[var(--color-gold)] hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(11,31,58,0.08)] relative overflow-hidden group cursor-pointer h-full flex flex-col"
                >
                  {service.premier && <div className="absolute top-0 right-0 bg-[var(--color-gold)] text-[var(--color-primary)] text-[10px] py-[4px] px-[12px] font-bold uppercase tracking-wider">Premier</div>}
                  <div className="w-14 h-14 bg-[#F8F9FA] rounded flex items-center justify-center text-[var(--color-gold)] mb-[20px] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h3 className="font-serif text-[22px] mb-[10px] text-[var(--color-primary)] font-bold group-hover:text-[var(--color-gold)] transition-colors">{service.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-[1.6] mb-4 flex-grow">{service.items}</p>
                  <div className="flex items-center text-[12px] font-bold uppercase tracking-wider text-[var(--color-primary)] group-hover:text-[var(--color-gold)] transition-colors mt-auto">
                    Learn More <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white py-[80px]">
        <div className="container mx-auto px-4 md:px-14">
          <div className="bg-[var(--color-primary)] rounded-lg shadow-xl p-10 md:p-14 text-center mb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none transform translate-x-1/4 -translate-y-1/4 text-white">
               <Scale size={350} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-[20px]">Why Choose LexVerma & Associates</h2>
              <div className="w-[80px] h-[3px] bg-[var(--color-gold)] mx-auto mb-[25px]"></div>
              <p className="text-[#E2E8F0] max-w-3xl mx-auto text-[16px] md:text-[18px] leading-relaxed">
                We blend decades of legal acumen with a relentless drive for justice. Our track record of success is built on integrity, strategic brilliance, and an unwavering commitment to defending our clients' rights at every level of the judiciary.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Experienced Advocates", icon: <Users size={32} strokeWidth={1.5} />, desc: "A team of seasoned professionals with decades of combined courtroom experience." },
              { title: "Strategic Litigation", icon: <Gavel size={32} strokeWidth={1.5} />, desc: "We craft aggressive and smart legal strategies tailored to win complex cases." },
              { title: "Transparent Fees", icon: <Scale size={32} strokeWidth={1.5} />, desc: "No hidden costs. Completely transparent fee structures for all our legal matters." },
              { title: "Confidential Advice", icon: <Shield size={32} strokeWidth={1.5} />, desc: "Strict adherence to attorney-client privilege. Your privacy is our highest priority." },
              { title: "Fast Response", icon: <CheckCircle size={32} strokeWidth={1.5} />, desc: "We understand legal issues are urgent. We ensure rapid communication and action." },
              { title: "Strong Court Representation", icon: <Building2 size={32} strokeWidth={1.5} />, desc: "Commanding presence across District Courts, High Courts, and Tribunals." }
            ].map((item, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                key={i} 
                className="p-8 border-l-[3px] border-l-[var(--color-gold)] bg-[#FAFBFC] hover:bg-white hover:shadow-[0_15px_40px_rgba(11,31,58,0.08)] transition-all duration-300 rounded-r shadow-sm group flex flex-col items-start"
              >
                <div className="w-16 h-16 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-[var(--color-gold)] mb-6 shadow-[0_4px_10px_rgba(11,31,58,0.15)] group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-primary)] transition-colors duration-300 transform group-hover:-translate-y-1">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 text-[var(--color-primary)]">{item.title}</h3>
                <p className="text-[14px] text-gray-600 leading-[1.7]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE REVIEWS */}
      <section className="bg-[var(--color-primary)] text-white py-[80px]">
        <div className="container mx-auto px-4 md:px-14">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/20 pb-8">
            <div>
              <h2 className="text-4xl font-serif font-bold text-white mb-4">Client Success Stories</h2>
              <div className="flex items-center gap-2 text-white/80">
                <span className="flex text-[var(--color-gold)]">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </span>
                <span>Based on verified Google Reviews</span>
              </div>
            </div>
            <Link to="/testimonials" className="mt-6 md:mt-0 bg-transparent border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] transition-colors px-6 py-3 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              Read All Reviews <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rahul Sharma", case: "High Court Writ", text: "LexVerma & Associates handled my writ petition with immense professionalism. Advocate Verma's arguments in the High Court were flawless." },
              { name: "Priya Singh", case: "Family Law", text: "During a very tough divorce, the team provided not just legal support but also empathy. We reached a mutual settlement smoothly." },
              { name: "Anil Desai", case: "Property Dispute", text: "Got an injunction on my property within 48 hours. Extremely fast and aggressive legal representation. Highly recommend." }
            ].map((review, i) => (
              <div key={i} className="bg-white/5 p-8 border border-white/10 hover:border-white/30 transition-colors">
                <div className="flex text-[var(--color-gold)] mb-4">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <p className="text-white/90 italic leading-relaxed mb-6 font-serif tracking-wide">"{review.text}"</p>
                <div>
                  <h4 className="font-bold text-white">{review.name}</h4>
                  <span className="text-[12px] text-[var(--color-gold)] uppercase tracking-wider">{review.case}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section className="bg-[var(--color-offwhite)] py-[80px]">
        <div className="container mx-auto px-4 md:px-14">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-[10px]">Meet Our Lead Advocates</h2>
            <div className="w-[60px] h-[3px] bg-[var(--color-gold)] mx-auto mt-[15px]"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Advocate 1 */}
            <div className="bg-white border border-gray-200 overflow-hidden group">
              <div className="h-[300px] overflow-hidden bg-gray-200">
                <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600" alt="Rahul Verma" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-primary)] mb-1">Adv. Rahul Verma</h3>
                <p className="text-[var(--color-gold)] font-bold uppercase tracking-wider text-xs mb-4">Associate</p>
                <p className="text-sm text-gray-600 mb-6">Expert in Family, Criminal, and Cyber cases.</p>
                <Link to="/team/rahul-verma" className="inline-block border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white px-6 py-2 text-sm font-bold uppercase tracking-wide transition-colors">View Profile</Link>
              </div>
            </div>
            {/* Advocate 2 */}
            <div className="bg-white border border-gray-200 overflow-hidden group">
              <div className="h-[300px] overflow-hidden bg-gray-200">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" alt="Trapti Singhal" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-primary)] mb-1">Adv. Trapti Singhal</h3>
                <p className="text-[var(--color-gold)] font-bold uppercase tracking-wider text-xs mb-4">Associate</p>
                <p className="text-sm text-gray-600 mb-6">Specializes in Corporate, Family and Criminal laws.</p>
                <Link to="/team/trapti-singhal" className="inline-block border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white px-6 py-2 text-sm font-bold uppercase tracking-wide transition-colors">View Profile</Link>
              </div>
            </div>
            {/* Advocate 3 */}
            <div className="bg-white border border-gray-200 overflow-hidden group md:hidden lg:block">
              <div className="h-[300px] overflow-hidden bg-gray-200">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600" alt="Sagar Modi" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-serif font-bold text-2xl text-[var(--color-primary)] mb-1">Adv. Sagar Modi</h3>
                <p className="text-[var(--color-gold)] font-bold uppercase tracking-wider text-xs mb-4">Associate</p>
                <p className="text-sm text-gray-600 mb-6">Expert in civil, criminal and corporate laws.</p>
                <Link to="/team/sagar-modi" className="inline-block border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white px-6 py-2 text-sm font-bold uppercase tracking-wide transition-colors">View Profile</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURT COVERAGE */}
      <section className="bg-white py-[60px] border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-70 grayscale">
            <span className="font-serif font-bold text-xl md:text-2xl flex items-center gap-2"><Scale size={24} /> Supreme Court</span>
            <span className="font-serif font-bold text-xl md:text-2xl flex items-center gap-2"><Building2 size={24} /> Delhi High Court</span>
            <span className="font-serif font-bold text-xl md:text-2xl flex items-center gap-2"><MapPin size={24} /> District Courts</span>
            <span className="font-serif font-bold text-xl md:text-2xl flex items-center gap-2"><FileText size={24} /> NCLT & Tribunals</span>
          </div>
        </div>
      </section>

      {/* FAST CONSULTATION FORM & FAQ */}
      <section className="py-[80px] bg-[var(--color-primary)] text-white relative">
        <div className="absolute inset-0 z-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 md:px-14 relative z-10 grid lg:grid-cols-2 gap-16">
          
          {/* Quick Form */}
          <div className="bg-white text-[var(--color-primary)] p-8 shadow-2xl rounded">
            <h3 className="text-3xl font-serif font-bold mb-2">Request Free Callback</h3>
            <p className="text-gray-500 mb-6 text-sm">Fill out this quick form and our legal team will call you within 2 hours.</p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Short form submitted! Redirecting to full booking flow in production.'); }}>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" required className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)]" />
                <input type="tel" placeholder="Phone Number" required className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="City" required className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)]" />
                <select required className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)]">
                  <option value="">Case Type</option>
                  <option value="criminal">Criminal</option>
                  <option value="civil">Civil</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <textarea placeholder="Brief Message" rows={3} className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[var(--color-primary)]"></textarea>
              <button type="submit" className="w-full bg-[var(--color-gold)] text-[var(--color-primary)] font-bold uppercase tracking-wider py-4 hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                Request Callback
              </button>
            </form>
          </div>

          {/* FAQ Accordion snippet */}
          <div>
            <h3 className="text-3xl font-serif font-bold mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                { q: "What are your consultation charges?", a: "We maintain transparent fee structures. An initial consultation fee applies which covers a deep review of your matter." },
                { q: "Do you handle High Court matters?", a: "Yes, our team actively practices in the Delhi High Court for writs, appeals, and bail matters." },
                { q: "How soon can you start working on my case?", a: "For urgent matters like anticipatory bail, we act immediately upon formal engagement." },
                { q: "Will my information remain confidential?", a: "All communications are strictly protected by attorney-client privilege from the very first contact." }
              ].map((faq, idx) => (
                <div key={idx} className="border border-white/20 hover:border-white/40 transition-colors bg-white/5">
                  <button 
                    className="w-full text-left p-4 font-serif text-lg flex justify-between items-center focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-[var(--color-gold)]' : ''}`} size={20} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-3 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link to="/faq" className="mt-6 flex items-center text-[var(--color-gold)] hover:text-white font-bold uppercase tracking-wider text-sm transition-colors w-max">
              View All FAQs <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[var(--color-gold)] py-[40px] border-t-8 border-white">
        <div className="container mx-auto px-4 md:px-14 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
          <div className="text-[var(--color-primary)]">
            <h2 className="text-[28px] md:text-[32px] font-serif font-bold mb-2">Need Immediate Legal Help?</h2>
            <p className="text-[15px] font-bold opacity-80 max-w-[600px]">Don't navigate the legal system alone. Get expert guidance and strong representation today.</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-[15px] shrink-0 w-full md:w-auto">
            <a href="tel:+91xxxxxxxx02" className="bg-[var(--color-primary)] text-white px-8 py-3 font-bold uppercase tracking-[1px] text-[13px] hover:bg-black transition-colors w-full sm:w-auto">
              Call Now: +91 xxxxxxxx02
            </a>
            <Link to="/booking" className="bg-white text-[var(--color-primary)] px-8 py-3 font-bold uppercase tracking-[1px] text-[13px] hover:bg-gray-100 transition-colors w-full sm:w-auto border border-[var(--color-primary)]/10">
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
