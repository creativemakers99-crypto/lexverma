import { Calendar, User, ArrowRight, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';

const posts = [
  {
    title: "How Anticipatory Bail Works in India: A Complete Guide",
    category: "Criminal Law",
    date: "August 12, 2026",
    author: "Adv. Aman Singh",
    excerpt: "Understanding the nuances of Section 438 of CrPC. When should you apply for anticipatory bail, and what are the crucial grounds that courts consider?",
    img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Mutual Consent Divorce: Process, Timeline, and Requirements",
    category: "Family Law",
    date: "July 28, 2026",
    author: "Adv. Priya Sharma",
    excerpt: "A step-by-step walkthrough of obtaining a mutual consent divorce under the Hindu Marriage Act. Learn about the mandatory cooling-off period and how to waive it.",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Step-by-Step Guide to FIR Quashing in High Court",
    category: "High Court Matters",
    date: "July 10, 2026",
    author: "Adv. Rahul Verma",
    excerpt: "False implication in criminal cases is common. Learn how Section 482 of CrPC empowers the High Court to quash baseless FIRs and secure your freedom.",
    img: "https://images.unsplash.com/photo-1505664173615-04f18d7f7fa0?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Protecting Ancestral Property: Legal Rights and Remedies",
    category: "Civil Law",
    date: "June 22, 2026",
    author: "Adv. Neha Jain",
    excerpt: "Disputes over ancestral property can tear families apart. Know your legal rights as a coparcener and how to file a partition suit effectively.",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600"
  }
];

const categories = ["Criminal Law", "Civil Law", "Family Law", "High Court Matters", "Corporate Law", "Legal Updates"];

export default function Blog() {
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await axios.get('/api/legal-news');
        if(res.data.success) {
          setLiveNews(res.data.items);
        }
      } catch (err) {
        console.error("Failed to fetch live legal news");
      } finally {
        setNewsLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="bg-[var(--color-offwhite)]">
      <SEO title="Legal Insights & Live Updates" description="Stay updated with the latest in Indian jurisprudence, legal rights, and live High Court and Supreme Court news." />
      <section className="bg-[var(--color-primary)] py-24 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Legal Insights & Blog</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">Stay updated with the latest in Indian jurisprudence and legal rights.</p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post, i) => (
                <article key={i} className="bg-white border border-gray-200 group">
                  <div className="overflow-hidden">
                    <img src={post.img} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-gold)] mb-3 block">{post.category}</span>
                    <h2 className="text-xl font-serif text-[var(--color-primary)] font-bold mb-3 leading-tight group-hover:text-[var(--color-gold)] transition-colors">
                      <Link to="#">{post.title}</Link>
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
                       <div className="flex items-center gap-1"><Calendar size={14}/> {post.date}</div>
                       <div className="flex items-center gap-1"><User size={14}/> {post.author}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
               <button className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                 Load More Articles
               </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3 space-y-10">
            {/* Live Legal News Feed */}
            <div className="bg-white p-6 shadow-sm border-t-4 border-[#ff4e4e]">
              <h3 className="font-serif text-xl border-b border-gray-100 pb-3 mb-4 text-[var(--color-primary)] flex items-center justify-between">
                Live Legal News
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </h3>
              
              {newsLoading ? (
                <div className="text-sm text-gray-500 animate-pulse">Syncing live updates...</div>
              ) : liveNews.length > 0 ? (
                <ul className="space-y-4">
                  {liveNews.map((news, i) => (
                    <li key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <a href={news.link} target="_blank" rel="noopener noreferrer" className="block group">
                        <h4 className="text-sm font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-2 leading-snug mb-1">
                          {news.title}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                           <span className="text-xs text-gray-400">{new Date(news.pubDate).toLocaleDateString()}</span>
                           <ExternalLink size={12} className="text-gray-400 group-hover:text-[var(--color-gold)]" />
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">Live feed temporarily unavailable.</div>
              )}
            </div>

            {/* Search */}
            <div className="bg-white p-6 shadow-sm border-t-4 border-[var(--color-primary)]">
              <h3 className="font-serif text-xl text-[var(--color-primary)] mb-4">Search Articles</h3>
              <div className="relative">
                <input type="text" placeholder="Search..." className="w-full border border-gray-300 p-3 pr-10 outline-none focus:border-[var(--color-gold)]" />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 shadow-sm">
              <h3 className="font-serif text-xl border-b border-gray-100 pb-3 mb-4 text-[var(--color-primary)]">Categories</h3>
              <ul className="space-y-3">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <a href="#" className="flex items-center justify-between text-gray-600 hover:text-[var(--color-gold)] transition-colors">
                      <span>{cat}</span>
                      <ArrowRight size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Widget */}
            <div className="bg-[var(--color-primary)] text-white p-8 text-center">
              <h3 className="font-serif text-2xl mb-4">Need Legal Advice?</h3>
              <p className="text-gray-300 mb-6 text-sm">Do you have a specific matter related to one of these articles? Consult our experts.</p>
              <Link to="/booking" className="block bg-[var(--color-gold)] text-[var(--color-primary)] px-4 py-3 font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors">
                Book Consultation
              </Link>
            </div>
          </aside>

        </div>
      </section>
    </div>
  );
}
