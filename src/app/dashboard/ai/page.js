"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Copy, Check, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SUGGESTION_CHIPS = [
  "Show me all my exes and their phone numbers 📞",
  "Who have I not contacted in over a month? 👻",
  "Who's rated the highest? 🏆",
  "Show me everyone I'm currently talking to 💬",
  "Who are my favorites? ❤️",
  "Give me a summary of all my connections 📊",
];

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <div style={avatarStyle(false)}>
        <Bot size={18} color="var(--accent-pink)" />
      </div>
      <div style={bubbleStyle(false)}>
        <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent-pink)",
                display: "inline-block",
                animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy message"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-muted)",
        padding: "4px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        opacity: 0.6,
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.6)}
    >
      {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
    </button>
  );
}

const avatarStyle = (isUser) => ({
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: isUser
    ? "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))"
    : "rgba(236, 72, 153, 0.15)",
  border: isUser ? "none" : "1px solid rgba(236, 72, 153, 0.3)",
  boxShadow: isUser ? "0 0 12px rgba(139, 92, 246, 0.4)" : "0 0 12px rgba(236, 72, 153, 0.2)",
});

const bubbleStyle = (isUser) => ({
  background: isUser
    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15))"
    : "rgba(255,255,255,0.04)",
  padding: "0.875rem 1rem",
  borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
  maxWidth: "75%",
  border: isUser
    ? "1px solid rgba(139, 92, 246, 0.3)"
    : "1px solid rgba(255,255,255,0.08)",
  lineHeight: 1.6,
  fontSize: "0.95rem",
  wordBreak: "break-word",
});

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! 👋 I'm your HoeTracker AI. I know everything about your connections — ask me anything!\n\nTry something like: *\"Show me all my exes\"* or *\"Who has the highest rating?\"*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMessage = text.trim();
    if (!userMessage || loading) return;

    const newUserMsg = { role: "user", content: userMessage, timestamp: new Date() };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    // Build history for the API (exclude the initial greeting from history)
    const historyForApi = updatedMessages.slice(1).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: historyForApi.slice(0, -1) }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply, timestamp: new Date() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ ${data.message || "Something went wrong. Make sure your GEMINI_API_KEY is set in .env!"}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Network error. Please check your connection.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! 🧹 What do you want to know?",
        timestamp: new Date(),
      },
    ]);
    setInput("");
  };

  return (
    <>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .markdown-body p { margin-bottom: 0.5rem; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body ul, .markdown-body ol { padding-left: 1.25rem; margin: 0.5rem 0; }
        .markdown-body li { margin-bottom: 0.25rem; }
        .markdown-body strong { color: #f8fafc; font-weight: 600; }
        .markdown-body em { color: var(--accent-pink); font-style: italic; }
        .markdown-body code { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 { margin: 0.75rem 0 0.5rem; }
        .chip-btn:hover { background: rgba(139, 92, 246, 0.3) !important; border-color: var(--accent-purple) !important; color: white !important; transform: translateY(-1px); }
        .msg-bubble:hover .copy-btn { opacity: 1 !important; }
      `}</style>

      <div
        className="animate-fade-in"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 4rem)",
          maxWidth: "860px",
          margin: "0 auto",
          gap: "1rem",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)",
              }}
            >
              <Sparkles size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "700", lineHeight: 1 }}>AI Assistant</h1>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Powered by Gemini ✨
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            title="Clear chat"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
              color: "var(--text-muted)",
              padding: "0.5rem 0.875rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "var(--glass-border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <Trash2 size={15} /> Clear
          </button>
        </div>

        {/* Chat Window */}
        <div
          className="glass"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "1.25rem",
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              paddingRight: "0.25rem",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.1) transparent",
            }}
          >
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={i}
                  className="msg-bubble"
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                    flexDirection: isUser ? "row-reverse" : "row",
                    animation: "fadeIn 0.3s ease forwards",
                  }}
                >
                  <div style={avatarStyle(isUser)}>
                    {isUser ? <User size={18} /> : <Bot size={18} color="var(--accent-pink)" />}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: "4px", maxWidth: "75%" }}>
                    <div style={bubbleStyle(isUser)}>
                      {isUser ? (
                        <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                      ) : (
                        <div className="markdown-body">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", opacity: 0.6 }}>
                        {msg.timestamp ? formatTime(msg.timestamp) : ""}
                      </span>
                      {!isUser && (
                        <span className="copy-btn" style={{ opacity: 0, transition: "opacity 0.2s" }}>
                          <CopyButton text={msg.content} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips — shown when only the initial message is visible */}
          {messages.length <= 1 && !loading && (
            <div style={{ padding: "1rem 0 0.5rem" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                Quick questions:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    className="chip-btn"
                    onClick={() => sendMessage(chip)}
                    style={{
                      background: "rgba(139, 92, 246, 0.12)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                      borderRadius: "20px",
                      color: "var(--text-muted)",
                      padding: "0.4rem 0.875rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--glass-border)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your connections..."
              className="input-field"
              style={{ marginBottom: 0, flex: 1 }}
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !input.trim()}
              style={{
                padding: "0.75rem 1.25rem",
                opacity: loading || !input.trim() ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
