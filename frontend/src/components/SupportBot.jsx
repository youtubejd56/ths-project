import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, X, Sparkles, User, Zap, ShieldCheck, Heart, MessageSquare, Sun, Moon, Lock, Info, Calendar, Phone } from "lucide-react";
import api from "../api/axiosInstance";

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [messages, setMessages] = useState([
    { role: "bot", content: "👋 Hey there! I'm your THS Genius. Ready to explore?", isHtml: false }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Quick suggestions as requested
  const quickActions = [
    { label: "📚 Admission Info", query: "Tell me about admission", icon: <Info size={14} /> },
    { label: "📅 Latest Events", query: "What are the latest events?", icon: <Calendar size={14} /> },
  ];

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
    "contact developer": '📞 <a href="tel:8075631073" class="font-bold text-violet-400">8075631073</a> <br/> 🌐 <a href="https://youtubejd56.github.io/vinayak-portfolio/" target="_blank" rel="noopener noreferrer" class="text-violet-400 underline font-bold">Visit Portfolio</a>',
    "features": "✨ I can help you with admission queries, event updates, and quick school information. Ask me anything!",
    "help": "Try asking about 'admission', 'contact developer', or 'latest events'!",
    "admission": "📝 Admissions are currently open! You can fill out the form in the 'Admission' section of the website or visit the school office.",
    "events": "📅 Keep an eye on the 'Latest Events' section for upcoming school programs and celebrations!",
    "contact": "📞 0482 2205285, Email: Thspala@gmail.com",
    "location": "📍 The School is located in Pala, Kottayam, Kerala, India.",
    "staff upload": "🔒 **Staff Security Policy**: Only authorized staff members and school personnel are permitted to upload event pictures or modify site content. Please log in through the primary admin portal for these actions.",
    "staff": "🔒 **Staff Security Policy**: Only authorized staff members and school personnel are permitted to upload event pictures or modify site content.",
  };

  const handleSend = async (customMsg = null) => {
    const trimmedInput = (customMsg || input).trim();
    if (!trimmedInput) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedInput, isHtml: false },
    ]);
    if (!customMsg) setInput("");
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
        { role: "bot", content: "⚠️ My circuits are a bit fuzzy right now. Try again soon!", isHtml: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`support-bot-container font-sans ${isDark ? 'dark' : ''}`}>
      {/* VIBRANT TOGGLE BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 100 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-[0_15px_40px_rgba(79,70,229,0.5)] z-500 flex items-center justify-center group overflow-hidden bg-white p-[3px]"
          >
            {/* VIBRANT GRADIENT BORDER */}
            <div className="-inset-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-size-[200%_200%] animate-gradient-flow rounded-full" />

            <div className={`w-full h-full ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-full flex items-center justify-center relative z-10 transition-colors duration-300`}>
              <Bot size={34} className={`${isDark ? 'text-white' : 'text-slate-900'} group-hover:rotate-12 transition-transform duration-300`} />
            </div>

            {/* ONLINE BADGE */}
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 z-20 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* VIBRANT CHAT INTERFACE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 120, scale: 0.85, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 120, scale: 0.85, filter: "blur(20px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[calc(100vw-2rem)] md:w-[420px] h-[80vh] md:h-[680px] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] z-1000 overflow-hidden flex flex-col ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'} border transition-colors duration-500`}
          >
            {/* HEADER: USER REQUESTED Indigo-to-Purple Gradient */}
            <div className="relative pt-8 pb-6 px-7 bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-between shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)]">
              {/* GLASSY EFFECT */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-white/20" />

              <div className="flex items-center gap-4 relative z-10 text-white">
                <div className="relative group">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-2xl border border-white/30 shadow-inner overflow-hidden">
                    <motion.div
                      animate={{ y: [0, -3, 0], rotate: [0, -5, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      <Bot size={36} className="drop-shadow-xl" />
                    </motion.div>
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-green-400 rounded-full border-4 border-indigo-600 animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.6)]" />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-2">
                    THS GENIUS
                  </h3>
                  <div className="flex items-center gap-1.5 opacity-90 mt-0.5">
                    <Zap size={11} className="text-yellow-400 fill-yellow-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.25em]">AI Intelligence Unit</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                {/* DARK/LIGHT MODE TOGGLE */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/20 active:scale-90"
                  title={isDark ? "Switch to Day Vision" : "Switch to Night Vision"}
                >
                  {isDark ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/20 active:scale-95 shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* MESSAGE AREA */}
            <div className={`flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide relative ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-800'}`}>

              {/* VIBRANT RADIAL BACKGROUND */}
              <div className={`absolute inset-0 pointer-events-none opacity-30 ${isDark ? 'bg-[radial-gradient(circle_at_50%_-20%,#4f46e5_0%,transparent_50%)]' : 'bg-[radial-gradient(circle_at_50%_-20%,#818cf8_0%,transparent_40%)]'}`} />

              {/* WELCOME SUGGESTIONS */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5 py-2 relative z-10"
                >
                  <div className="flex items-center gap-2.5 px-1">
                    <div className="h-px bg-linear-to-r from-indigo-500 to-transparent flex-1 opacity-30" />
                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} font-black uppercase tracking-[0.3em]`}>Explore THS</p>
                    <div className="h-px bg-linear-to-l from-indigo-500 to-transparent flex-1 opacity-30" />
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action.query)}
                        className={`px-5 py-4 rounded-2xl border transition-all flex items-center justify-between group active:scale-[0.97] ${isDark
                          ? 'bg-white/4 border-white/5 text-slate-300 hover:bg-linear-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 shadow-sm'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${isDark ? 'text-indigo-400 group-hover:text-white' : 'text-indigo-600'}`}>{action.icon}</span>
                          <span className="text-sm font-bold tracking-tight">{action.label}</span>
                        </div>
                        <Zap size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-3 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 25 : -25, y: 15 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
                >
                  <div className={`flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1.5 shadow-xl transition-all ${msg.role === 'user'
                      ? 'bg-linear-to-tr from-indigo-600 to-purple-600 text-white'
                      : (isDark ? 'bg-white/10 text-indigo-400 border border-white/10' : 'bg-white text-indigo-600 border border-slate-200 shadow-md')
                      }`}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>

                    <div className="space-y-1.5 flex flex-col group">
                      <div className={`px-5 py-4 text-[14px] leading-relaxed shadow-2xl font-medium transition-all duration-300 ${msg.role === 'user'
                        ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-[1.8rem] rounded-tr-none hover:brightness-110'
                        : (isDark
                          ? 'bg-white/5 text-slate-200 rounded-[1.8rem] rounded-tl-none border border-white/5 backdrop-blur-md hover:bg-white/8'
                          : 'bg-white text-slate-800 rounded-[1.8rem] rounded-tl-none border border-slate-100 shadow-lg shadow-black/5')
                        }`}>
                        {msg.isHtml ? <div dangerouslySetInnerHTML={{ __html: msg.content }} className={`prose prose-sm ${isDark ? 'prose-invert' : 'prose-indigo'}`} /> : <p className="whitespace-pre-wrap">{msg.content}</p>}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 transition-opacity duration-500 ${isDark ? 'text-slate-600' : 'text-slate-400'} group-hover:opacity-100`}>
                        {msg.role === 'user' ? 'Digital Signature Verified' : 'THS Response Unit'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-indigo-400 border animate-pulse ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <Zap size={18} className="fill-indigo-500/30" />
                  </div>
                  <div className={`${isDark ? 'bg-white/8 border-white/5' : 'bg-slate-100 border-slate-200'} px-6 py-4 rounded-2xl rounded-tl-none flex gap-2 items-center shadow-lg`}>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-2 h-2 bg-indigo-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 bg-purple-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 bg-pink-500 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT SECTION */}
            <div className={`p-7 border-t transition-all duration-500 ${isDark ? 'bg-slate-900/40 border-white/5 shadow-[0_-15px_40px_rgba(0,0,0,0.2)]' : 'bg-slate-50 border-slate-100'}`}>
              <div className="relative group flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Ask THS Genius..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className={`w-full pl-13 pr-5 py-4.5 border-2 border-transparent focus:border-indigo-500/30 rounded-2.5xl transition-all outline-none text-sm font-bold ${isDark
                      ? 'bg-slate-800/50 text-white placeholder:text-slate-600 focus:bg-slate-800'
                      : 'bg-white text-slate-900 placeholder:text-slate-400 shadow-inner'
                      }`}
                  />
                  <div className="absolute left-4.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 group-focus-within:bg-indigo-500 group-focus-within:text-white transition-all">
                    <MessageSquare size={16} />
                  </div>
                </div>

                <motion.button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-15 h-15 rounded-2.5xl bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20 disabled:opacity-20 transition-all active:brightness-90"
                >
                  <Send size={26} className={loading ? "animate-pulse" : ""} />
                </motion.button>
              </div>

              {/* FOOTER: POWERED BY... */}
              <div className="mt-8 flex flex-col items-center gap-5">
                <div className="flex items-center justify-center gap-5 w-full overflow-hidden">
                  <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                  <p className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    VINAYAK <Heart size={10} className={`animate-pulse ${isDark ? 'fill-indigo-500 text-indigo-500' : 'fill-indigo-600 text-indigo-600'}`} />
                  </p>
                  <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                </div>

                <div className={`flex flex-col items-center gap-2 ${isDark ? 'opacity-50' : 'opacity-70'}`}>
                  <div className={`text-[9.5px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Powered by ths pala ai engine
                  </div>
                  {/* STAFF CAPABILITY NOTICE (Requested) */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? 'bg-orange-500/5 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                    <Lock size={11} className="animate-sparkle" />
                    <span className="text-[8.5px] font-black uppercase tracking-wider">School Media Updation: authorized Staff Only</span>
                  </div>
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
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 3s ease infinite;
        }
        .animate-sparkle {
          animation: sparkle 2s infinite;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default SupportBot;
