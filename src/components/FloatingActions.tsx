import { MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingActions() {
  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col gap-4">
      {/* WhatsApp */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:shadow-[#25D366]/30 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle fill="currentColor" size={28} />
      </a>
      
      {/* Phone */}
      <a
        href="tel:+919876543210"
        className="w-14 h-14 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform outline outline-2 outline-white/20 outline-offset-2"
        aria-label="Call Us"
      >
        <Phone fill="currentColor" size={24} />
      </a>
    </div>
  );
}
