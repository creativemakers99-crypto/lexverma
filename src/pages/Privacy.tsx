import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <div className="bg-white py-20 px-4">
      <SEO title="Privacy Policy" description="Privacy policy regarding how we handle client data, confidentiality, and attorney-client privilege." />
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-serif text-[var(--color-primary)] mb-8 border-b-2 border-[var(--color-gold)] pb-4 inline-block">Privacy Policy</h1>
        
        <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
          <p className="text-sm text-gray-500 uppercase tracking-widest">Last Updated: January 1, 2026</p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">1. Introduction</h2>
          <p>
            LexVerma & Associates ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or engage our legal services.
          </p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">2. Attorney-Client Privilege</h2>
          <p>
            All communications between you and our advocates during the course of a formal legal engagement are protected by attorney-client privilege. This policy governs general website usage and initial inquiries.
          </p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">3. Information We Collect</h2>
          <p>
            When you use our consultation form, career portal, or contact us via email/WhatsApp, we may collect:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact details (email, phone number, address).</li>
            <li>Basic details regarding your legal matter (provided voluntarily).</li>
            <li>Resumes/CVs if you apply for a job or internship.</li>
          </ul>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">4. How We Use Your Information</h2>
          <p>We use the collected information strictly for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Scheduling consultations and responding to your inquiries.</li>
            <li>Evaluating potential legal conflicts of interest.</li>
            <li>Processing job/internship applications.</li>
          </ul>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">5. Data Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. Information may only be disclosed if required by law, court order, or to establish/defend our legal rights.
          </p>

          <h2 className="text-xl font-serif text-[var(--color-primary)] mt-8 font-bold">6. Contact Us</h2>
          <p>
            If you have any questions concerning this Privacy Policy, please contact us at <strong>privacy@lexverma.in</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
