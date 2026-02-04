import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, X, Sparkles, User, MessageCircle, MoreHorizontal, ShieldCheck, Zap } from "lucide-react";
import api from "../api/axiosInstance";

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "👋 Hello! I'm the Pala THS Assistant. How can I help you today?", isHtml: false }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedAnswers = {
    "who developed this website": "👨‍💻 This vision was brought to life by **Vinayak NV**, a passionate developer dedicated to modernizing school infrastructure.",
    "who made this website": "👨‍💻 This platform was crafted with ❤️ by **Vinayak NV**.",
    "who created this website": "👨‍💻 This website was developed by **Vinayak NV**.",
    "who developed ai chatbot": "🤖 I was engineered and integrated by **Vinayak NV** to provide instant secondary support.",
    "who created ai chatbot": "🤖 My core integration was handled by **Vinayak NV**.",
    "who made this project": "🚀 This entire ecosystem was developed and deployed by **Vinayak NV**.",
    "contact developer": '📞 <a href="tel:8075631073" class="font-bold text-indigo-600">8075631073</a> <br/> 🌐 <a href="https://youtubejd56.github.io/vinayak-portfolio/" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline font-bold">Visit Portfolio</a>',
    "features": "✨ I can help you with admission queries, event updates, and quick school information. Ask me anything!",
    "help": "Try asking about 'admission', 'contact developer', or 'latest events'!",
    "admission": "📝 Admissions are currently open! You can fill out the form in the 'Admission' section of the website or visit the school office.",
    "events": "📅 Keep an eye on the 'Latest Events' section for upcoming school programs and celebrations!",
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedInput, isHtml: false },
    ]);
    setInput("");
    setLoading(true);

    const lowerInput = trimmedInput.toLowerCase();
    const matchedKey = Object.keys(predefinedAnswers).find(key => lowerInput.includes(key));

    if (matchedKey) {
      setTimeout(() => {
        const answer = predefinedAnswers[matchedKey];
        const isHtml = /<[^>]+>/.test(answer);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: answer, isHtml },
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const res = await api.post("/ai-chat/", { message: trimmedInput });
      const botReply = res.data.reply || "I'm processing your request. Could you rephrase that?";
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: botReply, isHtml: false },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ My AI circuits are currently resting. Please try again in a moment.", isHtml: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-bot-container">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 45, opacity: 0 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)",
              y: -5
            }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-3xl shadow-[0_15px_30px_-5px_rgba(99,102,241,0.3)] z-[100] bg-slate-900 flex items-center justify-center group overflow-hidden p-[2px]"
          >
            {/* RGB Animated Border Layer */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#ff0000,#ff00ff,#0000ff,#00ffff,#00ff00,#ffff00,#ff0000)] animate-spin-slow opacity-100 group-hover:animate-spin-fast transition-all" />

            <div className="w-full h-full bg-slate-900 rounded-[1.4rem] flex items-center justify-center relative z-10 transition-colors group-hover:bg-slate-800">
              <Bot size={28} className="text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>

            {/* Pulsing indicator */}
            <span className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 z-20 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(15px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(15px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-8 right-8 w-96 max-w-[calc(100vw-3rem)] h-[600px] bg-slate-50/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden z-[1000] ring-1 ring-black/5 p-1"
          >
            {/* RGB Animated Background Glow */}
            <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,#ff008033,#7928ca33,#ff008033)] animate-spin-slow pointer-events-none" />

            <div className="relative flex flex-col h-full w-full bg-slate-50/90 rounded-[2.2rem] overflow-hidden z-10">
              {/* Premium Glass Header */}
              <div className="relative p-7 bg-white/60 border-b border-black/5">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <Bot size={30} className="text-white -rotate-3" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight flex items-center gap-2">
                        THS Genius
                        <Sparkles size={16} className="text-indigo-500 animate-sparkle" />
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Zap size={10} className="text-amber-500 fill-amber-500" />
                          AI Agent Active
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Capability Banner */}
              <div className="px-7 py-2 bg-indigo-50/50 flex items-center gap-2 text-center justify-center">
                <ShieldCheck size={12} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">
                  Secure Academic AI Interface
                </span>
              </div>

              {/* Main Chat Feed */}
              <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7 scrollbar-hide bg-gradient-to-b from-transparent to-slate-100/30">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i === 0 ? 0.2 : 0, duration: 0.4 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1.5 shadow-sm ${msg.role === 'user'
                          ? 'bg-indigo-600 text-white shadow-indigo-200'
                          : 'bg-white text-indigo-600 border border-slate-100'
                        }`}>
                        {msg.role === 'user' ? <User size={18} /> : <Zap size={18} />}
                      </div>

                      <div className={`group relative transition-all duration-300 ${msg.role === 'user'
                          ? 'items-end'
                          : 'items-start'
                        }`}>
                        <div className={`px-5 py-4 text-sm leading-relaxed shadow-[0_5px_15px_-5px_rgba(0,0,0,0.05)] ${msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-[1.4rem] rounded-tr-none font-medium'
                            : 'bg-white text-slate-700 rounded-[1.4rem] rounded-tl-none border border-slate-100'
                          }`}>
                          {msg.isHtml ? <div dangerouslySetInnerHTML={{ __html: msg.content }} className="prose prose-sm prose-indigo" /> : <p>{msg.content}</p>}
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-tighter text-slate-400 mt-1.5 block px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'
                          }`}>
                          {msg.role === 'user' ? 'Sent' : 'THS Intelligence'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 max-w-[85%]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-indigo-600 flex items-center justify-center shadow-sm">
                      <Bot size={18} />
                    </div>
                    <div className="bg-white border border-slate-100 px-6 py-4 rounded-[1.4rem] rounded-tl-none flex gap-1.5 items-center shadow-sm">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Sleek Input Dock */}
              <div className="p-7 bg-white/60 backdrop-blur-md border-t border-slate-200/50">
                <div className="relative group flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="w-full pl-12 pr-5 py-4 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-indigo-500/20 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400"
                    />
                    <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
                  </div>

                  <motion.button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center transition-all disabled:opacity-30 disabled:scale-95 disabled:shadow-none bg-gradient-to-br from-indigo-600 to-purple-600 hover:shadow-indigo-200"
                  >
                    <Send size={22} className={loading ? "animate-pulse" : ""} />
                  </motion.button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="h-px flex-1 bg-slate-100" />
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">
                    THS AI Engine v2.0
                  </p>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .animate-sparkle {
          animation: sparkle 2s infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .animate-spin-fast {
          animation: spin 3s linear infinite;
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SupportBot;
