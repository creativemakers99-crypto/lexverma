import { useState, useRef, useEffect } from 'react';
import { ai, isGeminiConfigured } from '../services/gemini';
import { MessageSquare, X, Send, Minus, Bot, User } from 'lucide-react';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! I am your AI Legal Assistant powered by Gemini. Feel free to ask me general Indian law questions, or latest legal updates.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Track the actual ChatSession instance
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const initChat = () => {
    if (ai && !chatRef.current) {
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a friendly, knowledgeable Legal Assistant for an Indian Law Chamber. You can use Google Search to find recent laws or legal news. You are concise and professional. Do NOT provide binding legal advice; always advise consulting the firm's lawyers for formal representation.",
          tools: [{ googleSearch: {} }]
        }
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isGeminiConfigured()) return;

    if (!chatRef.current) {
      initChat();
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const responseStream = await chatRef.current!.sendMessageStream({ message: userMessage });
      
      const modelMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === modelMessageId ? { ...msg, text: msg.text + chunk.text } : msg
          )
        );
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'I am sorry, but an error occurred while processing your request. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setIsMinimized(false); initChat(); }}
        className="fixed bottom-24 md:bottom-28 right-6 z-40 w-14 h-14 bg-[var(--color-gold)] text-[var(--color-primary)] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform outline outline-2 outline-[var(--color-primary)] outline-offset-2"
        aria-label="Open AI Legal Assistant"
      >
        <MessageSquare fill="currentColor" size={28} />
        {isGeminiConfigured() && <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--color-offwhite)] animate-pulse"></div>}
      </button>
    );
  }

  return (
    <div className={`fixed right-0 sm:right-6 z-40 transition-all duration-300 shadow-2xl border border-gray-200 bg-white flex flex-col ${isMinimized ? 'bottom-16 md:bottom-6 w-full sm:w-72 h-14 rounded-t-lg border-b-0' : 'bottom-16 md:bottom-6 w-full sm:w-[400px] h-[500px] sm:h-[600px] sm:rounded-lg'}`}>
      
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white p-4 rounded-t-lg flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-[var(--color-gold)]" />
          <span className="font-serif font-bold tracking-wider">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2 opacity-80">
          {!isMinimized && (
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} className="hover:text-white transition-colors">
              <Minus size={18} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:text-red-400 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 bg-[#F5F7FA] space-y-4 custom-scrollbar">
            {!isGeminiConfigured() && (
               <div className="text-xs text-amber-600 bg-amber-50 p-2 text-center rounded">
                 Warning: GEMINI_API_KEY is not configured.
               </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[var(--color-gold)] text-[var(--color-primary)]' : 'bg-[var(--color-primary)] text-white'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-lg text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[var(--color-gold)] text-[var(--color-primary)] rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                   {msg.role === 'model' ? (
                     <div className="markdown-body text-sm prose prose-sm max-w-none">
                       <Markdown>{msg.text}</Markdown>
                     </div>
                   ) : (
                     msg.text
                   )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none flex items-center gap-1 shadow-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about legal process..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                disabled={isTyping || !isGeminiConfigured()}
              />
              <button 
                type="submit"
                disabled={isTyping || !input.trim() || !isGeminiConfigured()}
                className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-gold)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
            <div className="text-[10px] text-gray-400 text-center mt-2 px-2">
              This assistant provides general information only and is not legal advice.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
