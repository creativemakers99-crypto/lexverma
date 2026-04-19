import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale } from 'lucide-react';

export default function BCIDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem('bci_disclaimer_accepted');
    if (!hasAccepted) {
      // Add a slight delay for better UX
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bci_disclaimer_accepted', 'true');
    setIsOpen(false);
  };

  const handleDecline = () => {
    // If they decline, we can redirect them away from the site
    // This is common for advocate websites if the user refuses to accept the BCI rules
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-8 overflow-y-auto backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white max-w-3xl w-full rounded-sm shadow-2xl overflow-hidden my-auto"
          >
            <div className="bg-[var(--color-primary)] p-6 text-center text-white border-b-4 border-[var(--color-gold)]">
              <Scale size={40} className="text-[var(--color-gold)] mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-bold tracking-wide">Website Disclaimer</h2>
            </div>
            
            <div className="p-6 md:p-8 max-h-[50vh] overflow-y-auto text-sm text-gray-700 space-y-4 font-sans leading-relaxed">
              <p className="font-bold text-base text-[var(--color-primary)]">
                As per the rules of the Bar Council of India, law firms are not permitted to solicit work and advertise. By clicking on the "I Agree" button below, you acknowledge the following:
              </p>
              
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  There has been no advertisement, personal communication, solicitation, invitation or inducement of any sort whatsoever from us or any of our members to solicit any work through this website;
                </li>
                <li>
                  The user wishes to gain more information about us for his/her own information and use;
                </li>
                <li>
                  The information about us is provided to the user only on his/her specific request and any information obtained or materials downloaded from this website is completely at the user's volition and any transmission, receipt or use of this site is not intended to, and will not, create any lawyer-client relationship; and
                </li>
                <li>
                  None of the information contained on the website is in the nature of a legal opinion or otherwise amounts to any legal advice.
                </li>
              </ul>
              
              <p className="pt-2">
                LexVerma & Associates is not liable for any consequence of any action taken by the user relying on material/information provided under this website. In cases where the user has any legal issues, he/she in all cases must seek independent legal advice.
              </p>
            </div>
            
            <div className="bg-[#F9F8F6] p-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200">
              <button
                onClick={handleDecline}
                className="px-6 py-3 border border-gray-300 text-gray-600 font-bold uppercase tracking-wider text-xs hover:bg-gray-100 transition-colors w-full sm:w-auto"
              >
                I Disagree
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold uppercase tracking-wider text-xs hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] transition-colors w-full sm:w-auto"
              >
                I Agree & Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
