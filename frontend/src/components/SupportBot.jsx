import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, X } from "lucide-react";
import "../index.css"
import axios from "axios";

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Predefined answers (keys are lowercase)
  const predefinedAnswers = {
    "who developed this website": "👨‍💻 This website was developed by Vinayak NV.",
    "who made this website": "👨‍💻 This website was developed by Vinayak NV.", 
    "who created this website": "👨‍💻 This website was developed by Vinayak NV.",
    "who developed ai chatbot":
      "🤖 The AI chatbot was created and integrated by Vinayak NV.",
    "who created ai chatbot": "🤖 The AI chatbot was created by Vinayak NV.",
    "who made this project": "🚀 This project was fully developed by Vinayak NV.",
    // clickable phone + portfolio link. Uses tel: for phone and opens portfolio in a new tab.
    "contact developer":
      '📞 <a href="tel:8075631073">8075631073</a> <br/> 🌐 <a href="https://youtubejd56.github.io/vinayak-portfolio/" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Portfolio Link</a>',
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add user message instantly (plain text)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedInput, isHtml: false },
    ]);
    setInput("");
    setLoading(true);

    const lowerInput = trimmedInput.toLowerCase();

    // ✅ Check predefined answers first
    if (predefinedAnswers[lowerInput]) {
      const answer = predefinedAnswers[lowerInput];
      // mark as HTML if answer contains tags (safe because we control these strings)
      const isHtml = /<[^>]+>/.test(answer);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: answer, isHtml },
      ]);
      setLoading(false);
      return;
    }

    try {
      // Otherwise, call AI backend (Django/OpenAI)
      const res = await axios.post("http://127.0.0.1:8000/api/ai-chat/", {
        message: trimmedInput,
      });

      // assume backend returns plain text reply; mark isHtml=false
      const botReply = res.data.reply || "Hmm... I couldn't find an answer.";
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: botReply, isHtml: false },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Error connecting to AI server.", isHtml: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl relative"
        >
          <span className="absolute inset-0 rounded-full animate-pulse-rgb"></span>
          <motion.span
            animate={{
              rotate: [0, -12, 12, -8, 8, 0],
              y: [0, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 3,
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full flex items-center justify-center"
          >
            <Bot size={28} />
          </motion.span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[450px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={22} />
                <h2 className="text-lg font-semibold">AI Support Bot</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] shadow ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-green-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {/* render HTML only for trusted bot messages */}
                    {msg.role === "bot" && msg.isHtml ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />
                    ) : (
                      <div>{msg.content}</div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="text-sm text-gray-500 animate-pulse">
                  🤖 Bot is typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center border-t p-3 bg-white">
              <input
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportBot;
