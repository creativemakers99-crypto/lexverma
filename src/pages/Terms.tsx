import SEO from '../components/SEO';

export default function Terms() {
  return (
    <div className="bg-white py-20 px-4">
      <SEO title="Terms & Conditions" description="Terms and conditions for using the LexVerma & Associates website and legal services." />
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-serif text-[var(--color-primary)] mb-8 border-b-2 border-[var(--color-gold)] pb-4 inline-block">Terms & Conditions</h1>
        
        <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
          <p className="text-sm text-gray-500 uppercase tracking-widest">Last Updated: January 1, 2026</p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">1. Acceptance of Terms</h2>
          <p>
            By accessing the website of LexVerma & Associates (the "Website"), you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using the Website.
          </p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">2. No Attorney-Client Relationship</h2>
          <p>
            The information provided on this Website is for general informational purposes only and does not constitute legal advice. Sending an email, filling out a form, or contacting us via WhatsApp does not create an attorney-client relationship. Such a relationship is only formed upon the explicit signing of a Vakalatnama or formal engagement letter.
          </p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">3. Legal Content & Disclaimer</h2>
          <p>
            While we strive to keep the Blog and legal insights updated, the law is constantly evolving. LexVerma & Associates makes no warranties regarding the accuracy or completeness of the information on the Website. You must not act upon the information provided without seeking professional counsel.
          </p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">4. Intellectual Property</h2>
          <p>
            All content on this Website, including text, logos, and graphics, is the intellectual property of LexVerma & Associates. Reproduction or unauthorized use is strictly prohibited.
          </p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">5. Governing Law & Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with the Website shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
          </p>
        </div>
      </div>
    </div>
  );
}
