import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-offwhite)] py-20 px-4 text-center">
      <SEO title="Page Not Found" />
      <div className="max-w-md">
        <Scale className="mx-auto text-[var(--color-gold)] mb-8" size={80} strokeWidth={1} />
        <h1 className="text-8xl font-serif text-[var(--color-primary)] font-bold mb-4">404</h1>
        <h2 className="text-2xl font-serif text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-10">
          The page or legal resource you are looking for has been moved, deleted, or does not exist.
        </p>
        <Link to="/" className="bg-[var(--color-primary)] text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-gold)] hover:text-[#050D1A] transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
