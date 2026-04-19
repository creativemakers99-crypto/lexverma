import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';

const fallbackTestimonials = [
  {
    name: "Rajesh Kumar",
    city: "New Delhi",
    category: "Property Dispute",
    text: "LexVerma & Associates handled my ancestral property dispute with utmost professionalism. After years of being stuck, their aggressive strategy in the High Court finally brought us a favorable decree. Highly recommended for civil matters."
  },
  {
    name: "Anita M.",
    city: "Gurugram",
    category: "Family Law",
    text: "I was going through a very tough contested divorce. Adv. Priya Sharma was not only legally sharp but also very supportive. The firm handled the complexities of alimony and child custody brilliantly."
  },
  {
    name: "Sumit S.",
    city: "Noida",
    category: "Criminal Defense",
    text: "When an unlawful FIR was filed against me, I panicked. Adv. Rahul and his team moved swiftly, got my anticipatory bail approved, and eventually had the FIR quashed in the High Court. Absolute lifesavers."
  },
  {
    name: "TechVision Solutions Pvt Ltd",
    city: "New Delhi",
    category: "Corporate Compliance",
    text: "As a growing startup, we needed solid legal contracts and vendor agreements. The team at LexVerma provides us with rock-solid documentation. We feel legally secure doing business now."
  },
  {
    name: "Vikram Chatterjee",
    city: "Faridabad",
    category: "High Court Appeal",
    text: "The lower court's decision was against us, but Adv. Verma took the matter to the High Court, found critical flaws in the previous judgment, and won the appeal. Their knowledge of jurisprudence is exceptional."
  },
  {
    name: "Sneha & Amit",
    city: "New Delhi",
    category: "Mutual Consent Divorce",
    text: "Handled our mutual consent divorce smoothly without unnecessary delays. They drafted the settlement perfectly ensuring both parties were protected. Total peace of mind."
  }
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get('/api/reviews');
        if (res.data.success && res.data.data.reviews) {
          setReviews(res.data.data.reviews);
        } else {
          throw new Error('API config missing or no reviews');
        }
      } catch (error) {
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  return (
    <div>
      <SEO title="Client Testimonials & Google Reviews" description="Read live Google Reviews and testimonials from our verified clients about our law firm's exceptional services." />
      
      {/* Banner */}
      <section className="bg-[var(--color-primary)] py-24 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">What Our Clients Say</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">Real experiences from clients we've represented and protected.</p>
        </div>
      </section>

      <section className="py-20 bg-[var(--color-offwhite)] px-4 md:px-8">
        <div className="container mx-auto">
          {usingFallback && (
             <div className="mb-10 text-center bg-blue-50 text-blue-800 p-4 rounded border border-blue-200 text-sm max-w-2xl mx-auto">
               [Development Mode] Live Google Reviews sync is not configured. Please supply VITE_GOOGLE_MAPS_PLACE_ID and GOOGLE_PLACES_API_KEY in your environment variables. Showing fallback data.
             </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
               <div className="col-span-3 text-center py-20 text-gray-400">Loading verified reviews...</div>
            ) : usingFallback ? (
              fallbackTestimonials.map((t, i) => (
                <div key={i} className="bg-white p-8 shadow-sm border-t border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow">
                  <div className="flex text-[var(--color-gold)] mb-4">
                    <Star fill="currentColor" size={18} />
                    <Star fill="currentColor" size={18} />
                    <Star fill="currentColor" size={18} />
                    <Star fill="currentColor" size={18} />
                    <Star fill="currentColor" size={18} />
                  </div>
                  <p className="text-gray-600 mb-8 italic flex-grow">"{t.text}"</p>
                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    <h4 className="font-bold text-[var(--color-primary)]">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.city} • <span className="font-semibold text-[var(--color-gold)]">{t.category}</span></p>
                  </div>
                </div>
              ))
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="bg-white p-8 shadow-sm border-t border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow">
                  <div className="flex text-[var(--color-gold)] mb-4">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} fill="currentColor" size={18} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-8 italic flex-grow">"{r.text}"</p>
                  <div className="border-t border-gray-100 pt-4 mt-auto flex items-center gap-3">
                    {r.profile_photo_url && <img src={r.profile_photo_url} alt={r.author_name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />}
                    <div>
                      <h4 className="font-bold text-[var(--color-primary)]">{r.author_name}</h4>
                      <p className="text-sm text-gray-500">{r.relative_time_description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-6">Want to see more reviews? Check our Google profile.</p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-block border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors">
              View Google Reviews
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
