import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Cpu, Activity, Globe, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// -- SYSTEM STATUS COMPONENT --
const SystemStatus = () => {
  return (
    <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        <span>Link: Stable</span>
      </div>
      <div className="flex items-center gap-2">
        <Activity size={12} />
        <span>Core: Gemini 3 Pro</span>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <span>Latency: 24ms</span>
      </div>
    </div>
  );
};

// -- TYPING EFFECT COMPONENT --
const TypewriterEffect = ({ text }: { text: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono text-sm md:text-base leading-relaxed text-black dark:text-gray-200"
    >
      {text}
      <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse align-middle"></span>
    </motion.div>
  );
};

const MissionControlSection: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState<{role: string, text: string}[]>([]);
  const { t } = useThemeLanguage();
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    t('oracle_sugg_1'),
    t('oracle_sugg_2'),
    t('oracle_sugg_3')
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    // Only scroll if there is actual content/history to show. 
    // This prevents the page from jumping to this section on initial load.
    if (history.length > 0 || response) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [response, history]);

  const handleGenerate = async (inputPrompt: string = prompt) => {
    if (!inputPrompt.trim() || isStreaming) return;

    const currentPrompt = inputPrompt;
    setPrompt('');
    setIsStreaming(true);
    setResponse('');
    
    // Add user message to local history for display
    const newHistory = [...history, { role: 'user', text: currentPrompt }];
    setHistory(newHistory);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: "You are the 'Event Horizon Mainframe', an advanced AI specialized in aerospace engineering, astrophysics, and European space history. Your tone is professional, precise, technical but accessible (like a flight director or a sci-fi ship computer). Keep answers concise (max 150 words). Use metric units. Format important keywords in bold. If asked about non-space topics, politely redirect to space.",
        }
      });

      // Send message and get stream
      const resultStream = await chat.sendMessageStream({ message: currentPrompt });
      
      let fullText = "";
      for await (const chunk of resultStream) {
        const text = chunk.text;
        if (text) {
            fullText += text;
            setResponse(prev => prev + text);
        }
      }

      // Finalize
      setHistory(prev => [...prev, { role: 'model', text: fullText }]);
      setResponse(''); // Clear stream buffer as it's now in history

    } catch (err) {
      console.error("Error:", err);
      setHistory(prev => [...prev, { role: 'model', text: "ERROR: CONNECTION LOST. ATMOSPHERIC INTERFERENCE DETECTED." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <motion.section 
      id="oracle" 
      className="py-24 px-4 md:px-12 max-w-[1800px] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Description */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
                <Cpu size={32} strokeWidth={1.5} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Mainframe Connect</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-black dark:text-white transition-colors">
              {t('oracle_title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
              {t('oracle_desc')}
            </p>
          </div>

          <div className="space-y-4">
             <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{t('oracle_quick_access')}</p>
             {suggestions.map((sugg, i) => (
                 <button 
                    key={i}
                    onClick={() => handleGenerate(sugg)}
                    disabled={isStreaming}
                    className="block w-full text-left p-4 rounded-xl text-sm font-medium bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-white/10 hover:border-blue-200 dark:hover:border-white/20 transition-all duration-300 text-gray-700 dark:text-gray-300 group"
                 >
                    <div className="flex items-center justify-between">
                        <span>{sugg}</span>
                        <Zap size={14} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                    </div>
                 </button>
             ))}
          </div>
        </div>

        {/* Right: Terminal Interface */}
        <div className="lg:col-span-8">
          <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 shadow-2xl transition-colors duration-500 min-h-[600px] flex flex-col">
            
            {/* Header/Status Bar */}
            <div className="bg-gray-200 dark:bg-white/5 p-4 border-b border-gray-300 dark:border-white/5 flex justify-between items-center backdrop-blur-md">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                    <Globe size={14} className="text-black dark:text-white" />
                    <span className="text-[10px] font-mono uppercase text-black dark:text-white">ESA_NODE_01 // G-3-PRO</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow p-6 md:p-10 overflow-y-auto font-sans space-y-8 relative">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(0deg,transparent_24%,rgba(0,0,0,1)_25%,rgba(0,0,0,1)_26%,transparent_27%,transparent_74%,rgba(0,0,0,1)_75%,rgba(0,0,0,1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,0,0,1)_25%,rgba(0,0,0,1)_26%,transparent_27%,transparent_74%,rgba(0,0,0,1)_75%,rgba(0,0,0,1)_76%,transparent_77%,transparent)] dark:bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,1)_25%,rgba(255,255,255,1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,1)_75%,rgba(255,255,255,1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,1)_25%,rgba(255,255,255,1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,1)_75%,rgba(255,255,255,1)_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div>

                {history.length === 0 && !response && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center select-none">
                        <Terminal size={64} className="mb-4" />
                        <p className="font-mono text-sm uppercase tracking-widest">System Ready</p>
                        <p className="font-mono text-xs mt-2">Awaiting input coordinates...</p>
                    </div>
                )}

                {history.map((msg, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <span className="text-[10px] uppercase font-bold tracking-widest mb-2 text-gray-400">
                            {msg.role === 'user' ? 'COMMANDER' : 'MAINFRAME'}
                        </span>
                        <div className={`max-w-[85%] p-6 rounded-2xl ${
                            msg.role === 'user' 
                            ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none' 
                            : 'bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-black dark:text-gray-200 rounded-tl-none'
                        }`}>
                            <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{msg.text}</p>
                        </div>
                    </motion.div>
                ))}

                {/* Streaming Response */}
                {isStreaming && (
                    <div className="flex flex-col items-start">
                         <span className="text-[10px] uppercase font-bold tracking-widest mb-2 text-blue-500 animate-pulse">
                            PROCESSING STREAM...
                        </span>
                        <div className="max-w-[85%] p-6 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-tl-none shadow-lg">
                             <TypewriterEffect text={response} />
                        </div>
                    </div>
                )}
                
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white dark:bg-white/5 border-t border-gray-200 dark:border-white/10 backdrop-blur-xl">
                <SystemStatus />
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder={t('oracle_placeholder')}
                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/20 rounded-xl py-4 pl-6 pr-16 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                    />
                    <button 
                        onClick={() => handleGenerate()}
                        disabled={!prompt.trim() || isStreaming}
                        className="absolute right-2 p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

          </div>
        </div>

      </div>
    </motion.section>
  );
};

export default MissionControlSection;