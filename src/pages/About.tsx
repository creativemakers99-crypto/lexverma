import { motion } from 'motion/react';
import { Award, ShieldCheck, Scale, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex flex-col">
      <SEO title="About Us | LexVerma & Associates" description="Learn about LexVerma & Associates, our founder, and our expert team of lawyers dedicated to providing premium legal services." />
      {/* Banner */}
      <section className="bg-[var(--color-primary)] py-24 text-center text-white relative">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1505664173615-04f18d7f7fa0?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Who We Are</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">A legacy of trust, excellence, and proven legal strategies.</p>
        </div>
      </section>

      {/* Our Story / Founder */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full lg:w-1/2">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Founder" className="rounded-sm shadow-2xl" />
                <div className="absolute -bottom-8 -right-8 bg-[var(--color-primary)] text-white p-8 rounded-sm hidden md:block">
                  <div className="font-serif text-4xl text-[var(--color-gold)] mb-1">15+</div>
                  <div className="text-sm uppercase tracking-widest font-semibold">Years of<br/>Excellence</div>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full lg:w-1/2">
              <span className="text-[var(--color-gold)] uppercase tracking-widest text-sm font-bold mb-4 block">Founder's Message</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-primary)] mb-6 text-balance">Committed to Securing Your Rights and Future.</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  At LexVerma & Associates, our core philosophy is simple: delivering strategic, uncompromising, and highly effective legal representation for our clients. For over 15 years, we have stood as a pillar of trust in the legal community.
                </p>
                <p>
                  Whether it is a complex High Court writ, a high-stakes corporate negotiation, or a sensitive family dispute, we approach every case with meticulous preparation and an aggressive pursuit of justice.
                </p>
                <p className="italic border-l-4 border-[var(--color-gold)] pl-4 py-2 mt-6 bg-gray-50">
                  "Our goal is not just to practice law, but to provide solutions that protect our client's interests to the absolute maximum."
                </p>
              </div>
              <div className="mt-8">
                <h4 className="font-serif font-bold text-xl text-[var(--color-primary)]">Adv. xxxxxxx</h4>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Founder & Senior Advocate</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#F5F2ED] py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-sm shadow-sm border-t-4 border-[var(--color-primary)]">
              <ShieldCheck className="text-[var(--color-gold)] mb-6" size={40} />
              <h3 className="text-2xl font-serif text-[var(--color-primary)] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide top-tier legal services with absolute transparency, unwavering ethics, and dedicated advocacy, ensuring our clients receive the best possible outcome in every legal challenge.
              </p>
            </div>
            <div className="bg-white p-10 rounded-sm shadow-sm border-t-4 border-[var(--color-gold)]">
              <Scale className="text-[var(--color-primary)] mb-6" size={40} />
              <h3 className="text-2xl font-serif text-[var(--color-primary)] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be recognized nationally as the most trusted and results-driven legal chamber, setting new benchmarks for professionalism and client satisfaction in the Indian legal landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-4">Meet Our Legal Experts</h2>
            <div className="w-20 h-1 bg-[var(--color-gold)] mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { id: "rahul-verma", name: "Adv. Rahul Verma", role: "Associate", type: "Family, Criminal, and Cyber cases", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400&h=400" },
              { id: "trapti-singhal", name: "Adv. Trapti Singhal", role: "Associate", type: "Corporate, Family and Criminal laws", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400" },
              { id: "sagar-modi", name: "Adv. Sagar Modi", role: "Associate", type: "Civil, criminal and corporate laws", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400" }
            ].map((member, i) => (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} key={i} className="group cursor-pointer">
                <Link to={`/team/${member.id}`}>
                  <div className="overflow-hidden mb-4 rounded-sm border border-gray-100">
                    <img src={member.img} alt={member.name} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[var(--color-primary)] transition-colors group-hover:text-[var(--color-gold)]">{member.name}</h4>
                  <p className="text-[var(--color-gold)] font-bold uppercase tracking-wider text-xs mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.type}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-[var(--color-primary)] py-16 text-center">
        <Link to="/booking" className="inline-block bg-[var(--color-gold)] text-[var(--color-primary)] px-10 py-4 font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors">
          Discuss Your Case With Us
        </Link>
      </section>
    </div>
  );
}
