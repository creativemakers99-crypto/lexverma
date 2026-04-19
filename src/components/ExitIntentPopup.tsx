import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Only run on desktop where mouse behavior is predictable
    if (window.innerWidth < 768) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse left the top of the window
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        // Save to session storage so we don't annoy them repeatedly
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    const isShown = sessionStorage.getItem('exitPopupShown');
    if (!isShown) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white relative z-10 max-w-lg w-full shadow-2xl overflow-hidden border-t-8 border-[var(--color-gold)]"
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-serif text-[var(--color-primary)] mb-4 font-bold">Wait! Need Legal Guidance?</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Before you leave, secure your peace of mind. Get a comprehensive legal analysis from our top advocates. Don't let your case go unprotected.
              </p>
              
              <Link 
                to="/booking" 
                onClick={() => setIsVisible(false)}
                className="inline-flex items-center justify-center w-full bg-[var(--color-primary)] text-white font-bold uppercase tracking-wider px-8 py-4 mb-4 hover:bg-[var(--color-gold)] hover:text-[#000] transition-colors"
              >
                <Calendar className="mr-2" size={20} /> Request Free Callback
              </Link>
              
              <button 
                onClick={() => setIsVisible(false)}
                className="text-sm font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 underline"
              >
                No thanks, I'll risk it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
