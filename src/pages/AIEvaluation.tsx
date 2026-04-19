import React, { useState } from 'react';
import { ai, isGeminiConfigured } from '../services/gemini';
import { Scale, BrainCircuit, AlertCircle, FileText, Download } from 'lucide-react';
import SEO from '../components/SEO';
import { ThinkingLevel, GenerateContentResponse } from '@google/genai';
import Markdown from 'react-markdown';

export default function AIEvaluation() {
  const [caseDetails, setCaseDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState('');

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseDetails.trim()) return;

    if (!isGeminiConfigured() || !ai) {
      setError('Gemini API is not configured. Please add GEMINI_API_KEY in the environment secrets.');
      return;
    }

    setLoading(true);
    setError(null);
    setEvaluation('');

    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.1-pro-preview",
        contents: `Evaluate the following legal scenario based on Indian Law context. Provide a high-level summary, potential legal risks, relevant statutes/sections if applicable, and a recommended course of action. Keep it structured and professional. \n\nScenario: ${caseDetails}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          systemInstruction: "You are an expert senior legal consultant at a top-tier Indian law firm. You evaluate cases strictly, logically, and professionally. Do not emit reasoning tokens to the user, only the final structural analysis.",
        }
      });

      for await (const chunk of responseStream) {
         setEvaluation(prev => prev + chunk.text);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during evaluation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-20 px-4">
      <SEO title="AI Case Evaluation | LexVerma & Associates" description="Get an instant preliminary AI evaluation of your legal matter using our high-intelligence legal analysis engine." />
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <BrainCircuit className="mx-auto text-[var(--color-gold)] mb-6" size={60} strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-primary)] mb-4">AI Deep Legal Evaluation</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our exclusive high-end intelligence engine, powered by Gemini 3.1 Pro, analyzes complex legal scenarios and provides preliminary insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="bg-[var(--color-offwhite)] p-8 border border-gray-100 shadow-lg">
             <h2 className="text-2xl font-serif text-[var(--color-primary)] mb-4 flex items-center gap-2">
               <FileText size={24} className="text-[var(--color-gold)]" /> Describe Your Case
             </h2>
             <p className="text-sm text-gray-500 mb-6">
                Please provide detailed facts, timelines, and the core issue. Avoid using highly sensitive personal identifiers.
             </p>

             <form onSubmit={handleEvaluate}>
               <textarea 
                  value={caseDetails}
                  onChange={(e) => setCaseDetails(e.target.value)}
                  className="w-full h-80 border border-gray-300 p-4 outline-none focus:border-[var(--color-primary)] transition-colors resize-none mb-6"
                  placeholder="E.g., In 2021, my business partner transferred funds to a competing shell company..."
                  required
               ></textarea>

               {!isGeminiConfigured() && (
                 <div className="mb-4 text-xs text-amber-600 bg-amber-50 p-3 border border-amber-200 flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>AI Engine disabled. Please configure GEMINI_API_KEY.</span>
                 </div>
               )}

               <button 
                  type="submit" 
                  disabled={loading || !caseDetails.trim() || !isGeminiConfigured()}
                  className="w-full bg-[var(--color-primary)] disabled:bg-gray-400 text-white p-4 font-bold uppercase tracking-widest hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
               >
                 {loading ? 'Evaluating (Requires High Thinking)...' : 'Run AI Evaluation'} 
                 {!loading && <BrainCircuit size={18} />}
               </button>
             </form>
          </div>

          {/* Output Section */}
          <div className="bg-[#050D1A] text-white p-8 relative overflow-hidden shadow-xl border-t-4 border-[var(--color-gold)]">
             <h2 className="text-2xl font-serif text-[var(--color-gold)] mb-6 flex items-center justify-between">
                Evaluation Report
                {evaluation && <Download size={20} className="cursor-pointer hover:text-white transition-colors" />}
             </h2>
             
             {error && (
                <div className="p-4 bg-red-900/50 border border-red-500 text-red-200">
                  {error}
                </div>
             )}

             {!evaluation && !loading && !error && (
                 <div className="h-64 flex flex-col items-center justify-center text-gray-500 opacity-50">
                    <Scale size={48} className="mb-4" />
                    <p>Report will be generated here.</p>
                 </div>
             )}

             {(evaluation || loading) && (
               <div className="prose prose-invert max-w-none text-sm leading-relaxed overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
                  <div className="markdown-body">
                    <Markdown>{evaluation}</Markdown>
                  </div>
                  {loading && <div className="mt-4 animate-pulse h-4 w-24 bg-white/20 rounded"></div>}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
