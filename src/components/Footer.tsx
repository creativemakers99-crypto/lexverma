import { Link } from 'react-router-dom';
import { Scale, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white pt-10 border-t-0">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-10 pb-10 border-b border-white/20">
          {/* About Firm */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--color-gold)] flex items-center justify-center font-serif font-bold text-[var(--color-primary)] text-2xl">
                V
              </div>
              <span className="font-serif font-bold text-[20px] tracking-wide uppercase text-white">
                LexVerma & Associates
              </span>
            </Link>
            <p className="mb-6 leading-relaxed text-white/70 text-[13px]">
              A premier law chamber committed to providing strategic, result-oriented, and ethical legal representation. We handle complex High Court, Civil, Criminal, and Family matters with unyielding dedication.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-white/20 rounded-full hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"><Facebook size={16} /></a>
              <a href="#" className="p-2 border border-white/20 rounded-full hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"><Twitter size={16} /></a>
              <a href="#" className="p-2 border border-white/20 rounded-full hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"><Linkedin size={16} /></a>
              <a href="#" className="p-2 border border-white/20 rounded-full hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"><Instagram size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-[20px] text-white mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-[13px] text-white/80 font-medium">
              <li><Link to="/about" className="hover:text-[var(--color-gold)] transition-colors">About Us</Link></li>
              <li><Link to="/career" className="hover:text-[var(--color-gold)] transition-colors">Career</Link></li>
              <li><Link to="/testimonials" className="hover:text-[var(--color-gold)] transition-colors">Testimonials</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--color-gold)] transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-[var(--color-gold)] transition-colors">Legal Blog</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-[20px] text-white mb-6">Practice Areas</h4>
            <ul className="flex flex-col gap-3 text-[13px] text-white/80 font-medium">
              <li><Link to="/services" className="hover:text-[var(--color-gold)] transition-colors">High Court Matters</Link></li>
              <li><Link to="/services" className="hover:text-[var(--color-gold)] transition-colors">Civil Law</Link></li>
              <li><Link to="/services" className="hover:text-[var(--color-gold)] transition-colors">Criminal Law</Link></li>
              <li><Link to="/services" className="hover:text-[var(--color-gold)] transition-colors">Family Law</Link></li>
              <li><Link to="/services" className="hover:text-[var(--color-gold)] transition-colors">Corporate Law</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-[20px] text-white mb-6">Contact Info</h4>
            <ul className="flex flex-col gap-4 text-[13px] text-white/80 font-medium">
              <li className="flex gap-3 items-start">
                <MapPin className="text-[var(--color-gold)] shrink-0 mt-1" size={16} />
                <span>123 Legal Tower, High Court Road, New Delhi, India 110001</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="text-[var(--color-gold)] shrink-0" size={16} />
                <a href="tel:+91xxxxxxxx02" className="hover:text-[var(--color-gold)] transition-colors">+91xxxxxxxx02</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="text-[var(--color-gold)] shrink-0" size={16} />
                <a href="mailto:info@lexverma.law" className="hover:text-[var(--color-gold)] transition-colors">info@lexverma.law</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-[15px] text-[12px]">
          <div>
            &copy; {new Date().getFullYear()} LexVerma & Associates. Justice. Integrity. Results.
          </div>
          <div className="flex gap-[20px] opacity-60 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
