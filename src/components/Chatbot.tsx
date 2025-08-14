'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageCircle, HelpCircle, BookOpen, FileText, Shield, Zap, Volume2, VolumeX } from 'lucide-react';
import { getAIResponse, hasAIAPIKeys, getAvailableAIServices } from '@/lib/aiChatService';
import { streamAIResponse } from '@/lib/streamingChatService';
import { 
  playMessageSent, 
  playMessageReceived, 
  playBubblePop, 
  playTypingTick, 
  playStreamingChunk,
  playKeyboardType,
  setSoundEnabled,
  soundService 
} from '@/lib/soundService';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  { icon: BookOpen, text: "Essay Writing Tips", key: "writing-tips" },
  { icon: FileText, text: "Grammar Help", key: "grammar-help" },
  { icon: Shield, text: "AI Detection Info", key: "ai-detection" },
  { icon: HelpCircle, text: "How to Use", key: "how-to-use" }
];

const BOT_RESPONSES = {
  "writing-tips": {
    text: "Here are proven essay writing strategies that will elevate your writing:",
    suggestions: [
      "🎯 Start with a compelling hook - use a surprising fact, quote, or question",
      "📝 Create a clear thesis statement that previews your main arguments",
      "🏗️ Use the PEEL structure: Point, Evidence, Explain, Link for body paragraphs",
      "📚 Incorporate credible sources and cite them properly (APA/MLA format)",
      "🔗 Use transition words to create smooth flow between ideas",
      "✍️ Write a powerful conclusion that reinforces your thesis and leaves impact",
      "📖 Read your essay aloud to catch awkward phrasing and improve rhythm"
    ]
  },
  "grammar-help": {
    text: "Master these grammar essentials to write with confidence and clarity:",
    suggestions: [
      "✅ Subject-verb agreement: 'The team IS' vs 'The teams ARE'",
      "📍 Apostrophes: It's = it is, Its = possessive (no apostrophe needed)",
      "🔗 Avoid run-ons: Use periods, semicolons, or conjunctions properly",
      "❌ Fix comma splices: Don't join independent clauses with just a comma",
      "💪 Prefer active voice: 'The researcher discovered' vs 'It was discovered'",
      "📝 Parallel structure: 'Reading, writing, and studying' (not 'to study')",
      "🔍 Proofread systematically: Read backwards for spelling, forward for flow"
    ]
  },
  "ai-detection": {
    text: "Our advanced AI detection helps ensure academic integrity and authentic writing:",
    suggestions: [
      "🤖 We use multiple AI detection models for comprehensive analysis",
      "📊 Confidence scores: 0-30% (Human), 31-70% (Mixed), 71-100% (AI-likely)",
      "✨ Write authentically: Use your own voice, experiences, and perspectives",
      "🎨 Vary sentence structure naturally - mix short and long sentences",
      "💭 Include personal insights, questions, and original connections",
      "📚 Always cite sources properly and add your own analysis",
      "🛡️ Academic integrity is about learning, not just avoiding detection"
    ]
  },
  "how-to-use": {
    text: "Welcome to Essaytude! Here's your complete guide to essay excellence:",
    suggestions: [
      "✍️ Step 1: Click 'Write Essay' to access our advanced editor",
      "📝 Step 2: Type or paste your essay (supports drafts and revisions)",
      "🔍 Step 3: Click 'Analyze' for comprehensive feedback and scoring",
      "📊 Step 4: Review detailed reports: Grammar, Style, Plagiarism, AI Detection",
      "💡 Step 5: Use AI suggestions to improve clarity, flow, and arguments",
      "🎓 Step 6: Apply feedback and re-analyze until you achieve excellence",
      "🤖 Pro Tip: Use our AI chatbot (me!) for instant writing advice anytime!"
    ]
  }
};

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `🎓 Welcome to Essaytude AI Assistant! I'm your personal writing coach powered by advanced AI (${getAvailableAIServices().join(', ')}). 

I can help you with:
✍️ Essay writing strategies & techniques
📝 Grammar, punctuation & style guidance  
🔍 Plagiarism & AI detection insights
📚 Research & citation assistance
🎯 Thesis development & argumentation
💡 Creative writing inspiration

Ask me anything about writing, or use the quick actions below!`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [aiEnabled] = useState(hasAIAPIKeys());
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle sound on/off
  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabledState(newSoundState);
    setSoundEnabled(newSoundState);
    
    // Play confirmation sound
    if (newSoundState) {
      playBubblePop();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<Message> => {
    try {
      console.log('🤖 Generating AI response for:', userMessage);
      
      // Get AI response
      const aiResponseText = await getAIResponse(userMessage);
      
      return {
        id: Date.now().toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response
      return {
        id: Date.now().toString(),
        text: "I'm having trouble connecting to AI services right now, but I can still help with essay writing tips! What specific area would you like assistance with?",
        isBot: true,
        timestamp: new Date()
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isStreaming) return;

    const userMessageText = inputText;
    
    // Play message sent sound
    await playMessageSent();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsStreaming(true);
    setStreamingText('');

    // Play bubble pop for message appearance
    setTimeout(() => playBubblePop(), 100);

    // Create placeholder for streaming message
    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      text: '',
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);

    try {
      await streamAIResponse(
        userMessageText,
        { provider: 'groq' }, // Default to Groq
        // On chunk received
        (chunk: string) => {
          // Play subtle streaming sound occasionally
          if (Math.random() < 0.1) { // 10% chance per chunk
            playStreamingChunk();
          }
          
          setStreamingText(prev => prev + chunk);
          // Update the last message in real-time
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex]?.id === botMessageId) {
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                text: newMessages[lastIndex].text + chunk
              };
            }
            return newMessages;
          });
        },
        // On complete
        () => {
          console.log('✅ Streaming complete');
          setIsStreaming(false);
          setStreamingText('');
          // Play completion sound
          playMessageReceived();
        },
        // On error
        (error: string) => {
          console.error('❌ Streaming error:', error);
          setIsStreaming(false);
          setStreamingText('');
          
          // Add error message
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "Sorry, I'm having trouble responding right now. Let me try a different approach to help you with your essay writing question!",
            isBot: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      );
    } catch (error) {
      console.error('Error in streaming:', error);
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  const handleQuickAction = (actionKey: string) => {
    // Play action sound
    playBubblePop();
    
    const response = BOT_RESPONSES[actionKey as keyof typeof BOT_RESPONSES];
    if (response) {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: response.text,
        suggestions: response.suggestions,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Play message received sound after a delay
      setTimeout(() => playMessageReceived(), 300);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Play typing sound
    if (e.key.length === 1) { // Only for character keys
      playKeyboardType();
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-popIn {
          animation: popIn 0.4s ease-out;
        }
      `}</style>
      <div className="fixed top-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 animate-popIn md:w-96 md:h-[600px] sm:w-80 sm:h-[520px] sm:top-2 sm:right-2 sm:max-w-[90vw] sm:max-h-[85vh]">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between sm:p-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0 sm:space-x-1">
            <div className="flex items-center space-x-2 sm:space-x-1">
              <Bot className="w-6 h-6 flex-shrink-0 sm:w-5 sm:h-5" />
              {aiEnabled && <Zap className="w-4 h-4 text-yellow-300 flex-shrink-0 sm:w-3 sm:h-3" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold flex items-center space-x-1 truncate sm:text-sm">
                <span className="truncate">Essaytude AI</span>
                <span className="hidden md:inline">Writing Assistant</span>
                {isStreaming && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse flex-shrink-0 sm:px-1 sm:text-[10px]">LIVE</span>}
              </h3>
              <p className="text-xs text-blue-100 sm:text-[10px] sm:leading-tight">
                {isStreaming ? '🔴 Streaming...' : '🧠 AI Ready'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0 sm:space-x-1">
            <button 
              onClick={toggleSound}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded touch-manipulation sm:p-1.5"
              title={soundEnabled ? "Disable sounds" : "Enable sounds"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <VolumeX className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
            </button>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded touch-manipulation sm:p-1.5"
            >
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-gray-200 sm:p-2">
        <p className="text-xs text-gray-600 mb-2 sm:text-[10px] sm:mb-1.5">Quick Actions:</p>
        <div className="grid grid-cols-2 gap-2 sm:gap-1.5">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.key}
              onClick={() => handleQuickAction(action.key)}
              className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors touch-manipulation sm:p-1.5 sm:space-x-1 sm:text-xs"
            >
              <action.icon className="w-4 h-4 text-blue-600 flex-shrink-0 sm:w-3 sm:h-3" />
              <span className="text-gray-700 truncate">{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:p-2 sm:space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
          >
            <div className={`max-w-[80%] sm:max-w-[85%] ${message.isBot ? 'bg-gray-100 transform hover:scale-105 transition-transform duration-200' : 'bg-blue-600 text-white transform hover:scale-105 transition-transform duration-200'} rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 sm:p-2`}>
              <div className="flex items-start space-x-2 sm:space-x-1.5">
                {message.isBot && (
                  <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0 animate-pulse sm:w-3 sm:h-3" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed break-words sm:text-xs">{message.text}</p>
                  {message.suggestions && (
                    <div className="mt-2 space-y-1 sm:mt-1.5 sm:space-y-0.5">
                      {message.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2 animate-slideIn sm:space-x-1.5" style={{animationDelay: `${index * 100}ms`}}>
                          <span className="text-green-500 text-xs mt-1 animate-bounce flex-shrink-0 sm:text-[10px] sm:mt-0.5">•</span>
                          <span className="text-xs text-gray-700 break-words sm:text-[10px] sm:leading-tight">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!message.isBot && (
                  <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0 sm:w-3 sm:h-3" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 sm:text-[10px] sm:mt-0.5">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isStreaming && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] shadow-sm sm:p-2 sm:max-w-[85%]">
              <div className="flex items-center space-x-2 sm:space-x-1.5">
                <Bot className="w-4 h-4 text-blue-600 animate-spin sm:w-3 sm:h-3" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse sm:w-1.5 sm:h-1.5"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse sm:w-1.5 sm:h-1.5" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse sm:w-1.5 sm:h-1.5" style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className="text-xs text-gray-500 animate-pulse sm:text-[10px]">AI is writing...</span>
              </div>
            </div>
          </div>
        )}
        
        {isTyping && !isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] sm:p-2 sm:max-w-[85%]">
              <div className="flex items-center space-x-2 sm:space-x-1.5">
                <Bot className="w-4 h-4 text-blue-600 sm:w-3 sm:h-3" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce sm:w-1.5 sm:h-1.5"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce sm:w-1.5 sm:h-1.5" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce sm:w-1.5 sm:h-1.5" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 sm:p-2">
        <div className="flex space-x-2 sm:space-x-1.5">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isStreaming ? "AI is responding..." : "Ask about essay writing..."}
            disabled={isStreaming}
            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed touch-manipulation sm:p-1.5 sm:text-xs"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isStreaming}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px] touch-manipulation sm:p-1.5 sm:min-w-[36px]"
          >
            {isStreaming ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin sm:w-3 sm:h-3"></div>
            ) : (
              <Send className="w-4 h-4 sm:w-3 sm:h-3" />
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 sm:text-[10px] sm:mt-1">
          Press Enter to send • Powered by AI
        </div>
      </div>
    </div>
    </>
  );
}
