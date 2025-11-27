import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader, AlertCircle } from 'lucide-react';
import './App.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  agent?: string;
  timestamp: Date;
  sources?: string[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/chat/message`, {
        message: input,
        conversation_id: conversationId,
      });

      const { message, conversation_id, agent_used, sources } = response.data;

      if (!conversationId) {
        setConversationId(conversation_id);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: message,
        agent: agent_used,
        timestamp: new Date(),
        sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Bot className="logo" size={32} />
          <div>
            <h1>AI Customer Support</h1>
            <p className="subtitle">Multi-Agent Support System</p>
          </div>
        </div>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <Bot size={64} className="welcome-icon" />
              <h2>Welcome to AI Customer Support</h2>
              <p>Ask me anything about our products, policies, or services!</p>
              <div className="suggestions">
                <button onClick={() => setInput('What is your return policy?')}>
                  Return Policy
                </button>
                <button onClick={() => setInput('How can I track my order?')}>
                  Track Order
                </button>
                <button onClick={() => setInput('What are the shipping options?')}>
                  Shipping Info
                </button>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-icon">
                {msg.role === 'user' ? (
                  <User size={20} />
                ) : (
                  <Bot size={20} />
                )}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                {msg.agent && (
                  <div className="message-meta">
                    <span className="agent-badge">{msg.agent}</span>
                    {msg.sources && msg.sources.length > 0 && (
                      <span className="sources">
                        Sources: {msg.sources.join(', ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-icon">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="typing">
                  <Loader className="spinner" size={20} />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;