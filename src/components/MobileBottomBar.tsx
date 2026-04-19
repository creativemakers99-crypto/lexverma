import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function MobileBottomBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down a bit
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50 flex">
      <a 
        href="tel:+919876543210" 
        className="flex-1 flex flex-col items-center justify-center p-3 text-[var(--color-primary)] hover:bg-gray-50 active:bg-gray-100 border-r border-gray-100"
      >
        <Phone size={20} className="mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
      </a>
      
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center p-3 text-[#25D366] hover:bg-gray-50 active:bg-gray-100 border-r border-gray-100"
      >
        <MessageCircle size={20} className="mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
      </a>

      <Link 
        to="/booking" 
        className="flex-[1.5] flex flex-col items-center justify-center p-3 bg-[var(--color-gold)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
      >
        <Calendar size={20} className="mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Consultation</span>
      </Link>
    </div>
  );
}
