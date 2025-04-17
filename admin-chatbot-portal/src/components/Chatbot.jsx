import { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/apiservice.js';

const Chatbot = ({ onLowConfidence }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      console.log("Calling getGeminiResponse with:", userMessage);
      // Call Gemini API using the function from apiservice.js
      const result = await getGeminiResponse(userMessage);
      console.log("Received result:", result);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: result.response,
        confidence: result.confidence
      }]);
      
      // Report low confidence responses to parent component
      if (result.confidence < 50) {
        onLowConfidence({ question: userMessage, confidence: result.confidence });
      }
    } catch (error) {
      console.error("Error:", error);
      
      // Fallback response
      const botResponse = "I'm having trouble processing your request right now.";
      const confidence = 30;
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: botResponse,
        confidence
      }]);
      
      onLowConfidence({ question: userMessage, confidence });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'bg-green-100 text-green-800';
    if (confidence >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Return the UI component (this was missing!)
  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-center">No messages yet. Start a conversation!</p>
            <p className="text-center text-sm mt-2">Try asking about registration, courses, financial aid, or housing.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 ${msg.type === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                msg.type === 'user' 
                  ? 'bg-blue-100 text-blue-900 rounded-tr-none' 
                  : 'bg-gray-100 text-gray-900 rounded-tl-none'
              }`}>
                <p>{msg.content}</p>
                {msg.type === 'bot' && (
                  <div className="mt-1 flex justify-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(msg.confidence)}`}>
                      {Math.round(msg.confidence)}% confidence
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="mb-4">
            <div className="inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded-lg rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-3 flex">
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className={`px-4 py-2 rounded-r-lg ${
            isLoading || !input.trim() 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;