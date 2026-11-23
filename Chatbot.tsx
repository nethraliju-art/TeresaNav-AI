import { useState, useRef, useEffect, type FormEvent } from "react";
import { CHAT_KB } from "../data/campusData";
import type { ChatMessage } from "../data/campusData";

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of CHAT_KB) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.response;
    }
  }
  return "I don't have specific information about that right now. You can try asking about campus blocks (A–E), FYUGP courses, the canteen, library, auditorium, or other facilities. For urgent queries, please visit the Administrative Office in Block A.";
}

function formatResponse(text: string) {
  // Strip common Markdown syntax that we don't render
  const cleaned = text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // **bold** → bold
    .replace(/\*(.*?)\*/g, "$1")       // *italic* → italic
    .replace(/`(.*?)`/g, "$1")         // `code` → code
    .replace(/^#+\s+(.*)$/gm, "$1");   // ## heading → heading

  // Regex to detect URLs (http/https and www.)
  const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  return cleaned.split("\n").map((line, i) => {
    const parts = line.split(URL_REGEX);

    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (!part) return null;
          if (URL_REGEX.test(part)) {
            const href = part.startsWith("http") ? part : `https://${part}`;
            return (
              <a
                key={j}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2B5E] underline hover:text-[#F4A12A] transition-colors"
              >
                {part}
              </a>
            );
          }
          return <span key={j}>{part}</span>;
        })}
        {i < cleaned.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

export default function Chatbot({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hello! I'm TeresaBot — your AI guide for St. Teresa's College. \n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    let reply = "";
    try {
            const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) {
        reply = data.error || "Sorry, I couldn't reach the server.";
      } else {
        reply = data.reply || "Sorry, I couldn't reach the server.";
      }
    } catch {
      // Fallback to local KB if Python backend is offline
      reply = getBotResponse(text);
    }

    const botMsg: ChatMessage = {
      id: `b${Date.now()}`,
      role: "bot",
      text: reply,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function clearChat() {
    setMessages([{
      id: "welcome2",
      role: "bot",
      text: "Chat cleared. How can I help you?",
      timestamp: new Date(),
    }]);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-[#D4D4CC] bg-white flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#38A169] animate-pulse flex-shrink-0" />
            <h1 className="font-display text-xl font-bold text-[#0F1623] truncate">TeresaBot</h1>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5 truncate">AI assistant powered by college data</p>
        </div>

        {/* Action buttons — Clear Chat + Close */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearChat}
            className="text-xs px-3 py-1.5 border border-[#D4D4CC] text-[#6B7280] hover:border-[#1A2B5E] hover:text-[#0F1623] rounded-sm transition-colors font-medium"
          >
            Clear Chat
          </button>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close chatbot"
              title="Close"
              className="w-8 h-8 rounded-sm border border-[#D4D4CC] text-[#6B7280] hover:border-[#1A2B5E] hover:text-[#0F1623] hover:bg-[#F2F2EE] transition-colors text-lg leading-none flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-sm font-bold font-display ${
              msg.role === "bot"
                ? "bg-[#1A2B5E] text-white"
                : "bg-[#F4A12A] text-[#0F1623]"
            }`}>
              {msg.role === "bot" ? "T" : "U"}
            </div>

            <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-sm text-sm leading-relaxed ${
                  msg.role === "bot"
                    ? "bg-white border border-[#D4D4CC] text-[#0F1623]"
                    : "bg-[#1A2B5E] text-white"
                }`}
              >
                {formatResponse(msg.text)}
              </div>
              <span className="text-[10px] font-mono-data text-[#6B7280] px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-[#1A2B5E] flex items-center justify-center text-sm font-bold font-display text-white flex-shrink-0">T</div>
            <div className="px-4 py-3 bg-white border border-[#D4D4CC] rounded-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-[#D4D4CC] bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about campus navigation, courses, rooms..."
            className="flex-1 px-4 py-2.5 border border-[#D4D4CC] rounded-sm text-sm focus:outline-none focus:border-[#1A2B5E] bg-[#F2F2EE] placeholder:text-[#9CA3AF]"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-5 py-2.5 bg-[#1A2B5E] text-white text-sm font-semibold rounded-sm hover:bg-[#243d80] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-display"
          >
            Send
          </button>
        </form>
        <p className="text-[10px] text-[#9CA3AF] mt-2 text-center font-mono-data">
          Data sourced from college records · For urgent help, visit Block A Administration
        </p>
      </div>
    </div>
  );
}