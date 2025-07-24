import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Minus, Trash2, BotMessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SyntherionResponse from './ui/SyntherionResponse';
import { getPricingOverview } from '../data/chatPricingContext';

// Helper function to extract bullets from malformed JSON
const extractBullets = (jsonString: string): string[] => {
  try {
    // Look for the bullets array pattern
    const bulletsMatch = jsonString.match(/"bullets":\s*\[(.*?)\]/s);
    if (bulletsMatch && bulletsMatch[1]) {
      // Extract individual bullet items
      const bulletItems = bulletsMatch[1].match(/"([^"]+)"/g);
      if (bulletItems) {
        return bulletItems.map(item => item.replace(/"/g, ''));
      }
    }
  } catch (e) {
    console.error('Error extracting bullets:', e);
  }
  return [];
};

// Debug utility for JSON parsing with enhanced error recovery
const debugJsonParse = (jsonString: string) => {
  console.log('Attempting to parse JSON string:', jsonString);
  console.log('String length:', jsonString.length);
  console.log('First 20 chars:', JSON.stringify(jsonString.substring(0, 20)));
  console.log('Last 20 chars:', JSON.stringify(jsonString.substring(jsonString.length - 20)));
  
  try {
    const parsed = JSON.parse(jsonString);
    console.log('Successfully parsed JSON:', parsed);
    return parsed;
  } catch (error: any) {
    console.error('Failed to parse JSON:', error);
    
    // If we have a specific position where the error occurred, try to fix it
    if (error && typeof error.message === 'string') {
      const positionMatch = error.message.match(/position (\d+)/i);
      if (positionMatch && positionMatch[1]) {
        const errorPosition = parseInt(positionMatch[1]);
        console.log(`Error at position ${errorPosition}, attempting to fix...`);
        
        // Check if the error is around position 573 (specific issue we've seen)
        if (errorPosition >= 570 && errorPosition <= 580 && jsonString.includes('"takeaway"')) {
          console.log('Detected the specific error at position ~573, applying targeted fix');
          // This is likely the issue with missing closing brace after takeaway
          try {
            // Extract all the key parts and rebuild the JSON object manually
            const sectionMatch = jsonString.match(/"section":\s*"([^"]+)"/i);
            const bodyMatch = jsonString.match(/"body":\s*"([^"]+)"/i);
            const reasoningMatch = jsonString.match(/"reasoning":\s*"([^"]+)"/i);
            const takeawayMatch = jsonString.match(/"takeaway":\s*"([^"]+)"/i);
            
            if (sectionMatch && bodyMatch && takeawayMatch) {
              const fixedJson = {
                section: sectionMatch[1],
                body: bodyMatch[1],
                reasoning: reasoningMatch ? reasoningMatch[1] : "Here's my reasoning.",
                bullets: extractBullets(jsonString),
                takeaway: takeawayMatch[1]
              };
              console.log('Successfully created fixed JSON for position 573 issue:', fixedJson);
              return fixedJson;
            }
          } catch (e) {
            console.error('Failed to fix position 573 issue:', e);
          }
        }
        
        // General case for missing closing brace or bracket
        if (jsonString.includes('"takeaway"')) {
          // Common error: missing closing brace after takeaway
          const takeawayMatch = jsonString.match(/"takeaway":\s*"([^"]+)"/i);
          if (takeawayMatch) {
            console.log('Found takeaway, trying to fix JSON structure');
            // Reconstruct the JSON with proper structure
            try {
              const fixedJson = {
                section: jsonString.match(/"section":\s*"([^"]+)"/i)?.[1] || "Response",
                body: jsonString.match(/"body":\s*"([^"]+)"/i)?.[1] || "Here's what you need to know.",
                reasoning: jsonString.match(/"reasoning":\s*"([^"]+)"/i)?.[1] || "Let me explain why.",
                bullets: extractBullets(jsonString),
                takeaway: takeawayMatch[1]
              };
              console.log('Created fixed JSON object:', fixedJson);
              return fixedJson;
            } catch (e) {
              console.error('Failed to create fixed JSON:', e);
            }
          }
        }
      }
    }
    return null;
  }
};
  
interface ChatInputProps {
  onSend: (userPrompt: string, eventContext?: string) => void;
  loading?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  // For assistant messages, we'll store the parsed JSON response
  parsedResponse?: any;
}

export const ChatInput: React.FC<ChatInputProps & { eventContext?: string }> = ({ onSend, loading, eventContext }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (userPrompt.trim()) {
      onSend(userPrompt, eventContext);
      setUserPrompt('');
    }
  };

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  return (
    <div className="w-full flex flex-col gap-2 bg-white/70 dark:bg-black/60 p-4 rounded-t-xl shadow-lg">
      <div className="flex items-end gap-2">
        <Textarea
          ref={inputRef}
          value={userPrompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserPrompt(e.target.value)}
          rows={2}
          placeholder="Type your message..."
          className="flex-1 resize-none bg-background/90 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
          disabled={loading}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <div className="relative">
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-0" style={{
            animationDuration: '2s',
            animationIterationCount: 'infinite'
          }} />
          
          {/* Static ring */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-400" />
          
          <Button
            onClick={handleSend}
            disabled={loading || !userPrompt.trim()}
            variant="default"
            size="icon"
            className="rounded-full relative z-10 shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            <BotMessageSquare className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ChatModelResponseProps {
  response: string;
  visible: boolean;
  loading?: boolean;
}

// Helper function to extract content from malformed JSON strings
const extractContent = (text: string) => {
  // Try to find and extract the body content
  const bodyMatch = text.match(/"body":\s*"([^"]+)"/i);
  if (bodyMatch && bodyMatch[1]) {
    return {
      section: 'Response',
      body: bodyMatch[1],
      bullets: extractBullets(text),
      takeaway: text.match(/"takeaway":\s*"([^"]+)"/i)?.[1] || ''
    };
  }
  return null;
};

export const ChatModelResponse: React.FC<ChatModelResponseProps> = ({ response, visible, loading }) => {
  // Try to parse the response as JSON using our debug utility
  let parsedResponse = null;
  
  if (typeof response === 'string') {
    // First try to parse as complete JSON
    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      // If that fails, try our debug parser
      parsedResponse = debugJsonParse(response);
      
      // If debug parser fails, try to extract content from the string
      if (!parsedResponse) {
        parsedResponse = extractContent(response);
      }
    }
  }

  // If we still don't have a parsed response, use the raw text
  const displayContent = parsedResponse ? (
    <SyntherionResponse data={parsedResponse} />
  ) : (
    <div className="p-4 whitespace-pre-line break-words text-base min-h-[1.5em] bg-background/95 dark:bg-zinc-900/95 text-black dark:text-white">
      {response}
    </div>
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'w-full rounded-xl border border-border',
            loading ? 'animate-pulse' : ''
          )}
          style={{ minHeight: 56 }}
        >
          {displayContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Props for StickyChat.
 * @param eventContext - (optional) Dynamic event context (e.g., current page or section) to provide extra context for the AI.
 */
interface StickyChatProps {
  /**
   * Function to call when the user sends a message.
   * @param userPrompt The user's message.
   * @param eventContext The dynamic event context.
   */
  onSend: (userPrompt: string, eventContext?: string) => Promise<string>;
  /**
   * Optional dynamic event context.
   */
  eventContext?: string;
}

export const StickyChat: React.FC<StickyChatProps> = ({ onSend, eventContext }) => {
  const location = useLocation();
  const isPricingPage = location.pathname.includes('/pricing');
  // Load messages from sessionStorage (if available) on mount
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('stickychat-messages');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Save messages to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem('stickychat-messages', JSON.stringify(messages));
  }, [messages]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userBlurred, setUserBlurred] = useState(false);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track previous message count to detect new messages
  const prevMessageCountRef = useRef(messages.length);

  useEffect(() => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (!messagesContainer) return;

    // Only auto-scroll if:
    // 1. Chat was just opened
    // 2. A new message was added (and it's from the assistant)
    const isNewMessage = messages.length > prevMessageCountRef.current;
    const isAssistantMessage = isNewMessage && messages[messages.length - 1]?.role === 'assistant';
    
    if (open) {
      if (isNewMessage && isAssistantMessage) {
        // For new assistant messages, scroll to the top of the message
        const lastMessage = messagesContainer.lastElementChild?.previousElementSibling;
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (messages.length === 0 || !isNewMessage) {
        // For other cases (like opening chat), scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
    
    // Update previous message count
    prevMessageCountRef.current = messages.length;
    
    // Auto-focus input unless user intentionally blurred
    if (!userBlurred && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, open, userBlurred]);

  const handleSend = async () => {
    if (input.trim()) {
      // Add user message to chat (without context)
      const userMessage: Message = {
        role: 'user',
        content: input, // Store original message without context
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setLoading(true);
      
      try {
        // Prepare the full context for the AI
        let fullContext = input;
        if (isPricingPage) {
          fullContext = `User is on the pricing page. ${input} \n\nPricing Context:\n${getPricingOverview()}`;
        }
        
        // Include both the original message and the enhanced context
        const response = await onSend(fullContext, eventContext || (isPricingPage ? 'pricing_page' : undefined));
        
        // Try to parse the response as JSON using our debug utility
        let parsedResponse = null;
        
        // Check if the response is already a valid JSON object string
        if (typeof response === 'string') {
          // Log the raw response for debugging
          console.log('Raw AI response:', response);
          
          // First try to parse the raw response
          parsedResponse = debugJsonParse(response);
          
          // If that fails, try with trimming
          if (!parsedResponse) {
            const trimmedResponse = response.trim();
            console.log('Trying with trimmed response');
            parsedResponse = debugJsonParse(trimmedResponse);
            
            // If still failing, try more aggressive cleaning
            if (!parsedResponse && trimmedResponse.startsWith('{') && trimmedResponse.endsWith('}')) {
              console.log('Trying with aggressive cleaning');
              // Remove any potential BOM, non-standard whitespace, or escape sequences
              const cleanedResponse = trimmedResponse
                .replace(/^\ufeff/g, '')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t');
              parsedResponse = debugJsonParse(cleanedResponse);
            }
          }
        }
        
        // Manual fallback if parsing failed but response looks like JSON
        if (!parsedResponse && typeof response === 'string' && response.includes('"section"')) {
          console.log('Attempting manual JSON extraction');
          try {
            // Try to extract the JSON by finding the first { and last }
            const firstBrace = response.indexOf('{');
            const lastBrace = response.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              const jsonSubstring = response.substring(firstBrace, lastBrace + 1);
              parsedResponse = debugJsonParse(jsonSubstring);
            }
          } catch (e) {
            console.error('Manual JSON extraction failed:', e);
          }
        }
        
        // Add AI response to chat
        const aiMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
          parsedResponse: parsedResponse
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error getting AI response:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Floating bubble button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white border border-blue-100 shadow-2xl rounded-full w-14 h-14 flex items-center justify-center hover:scale-105 focus:outline-none"
            onClick={() => setOpen(true)}
            aria-label="Open chat"
          >
            <BotMessageSquare className="w-12 h-12" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md sm:max-w-lg lg:max-w-xl rounded-3xl shadow-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-border flex flex-col"
            style={{ height: 600, maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                  <BotMessageSquare className="w-8 h-8" />
                </span>
                <span className="font-semibold text-lg text-black dark:text-white">Intellisync</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => setMessages([])} aria-label="Clear chat history" title="Clear chat history">
                  <Trash2 className="w-5 h-5 text-accent1" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close chat">
                  <Minus className="w-5 h-5 text-accent1" />
                </Button>
              </div>
            </div>

            {/* System prompt toggle (temporarily commented out)
            <div className="flex items-center justify-between px-4 pt-2 pb-1">
              <span className="text-xs text-gray-500">AI Persona Prompt</span>
              <Button size="icon" variant="ghost" onClick={() => setShowSystemPrompt((v) => !v)}>
                {showSystemPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            */}

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar">
              {messages.length === 0 && !loading && (
                <div className="text-center text-gray-400 text-sm mt-8">
                  Ask Intellisync!
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'user' ? (
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-line break-words text-base shadow-sm bg-blue-500 text-white rounded-br-md">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="max-w-[95%]">
                      {msg.parsedResponse ? (
                        <SyntherionResponse data={msg.parsedResponse} animate={false} />
                      ) : (
                        // Try to parse the content as JSON if it's a string that looks like JSON
                        typeof msg.content === 'string' && (msg.content.includes('"section"') || (msg.content.trim().startsWith('{') && msg.content.trim().endsWith('}'))) ? (
                          (() => {
                            let parsedContent = null;
                            
                            // First try direct parsing
                            if (typeof msg.content === 'string') {
                              parsedContent = debugJsonParse(msg.content);
                              
                              // If that fails, try with trimming
                              if (!parsedContent) {
                                const trimmedContent = msg.content.trim();
                                parsedContent = debugJsonParse(trimmedContent);
                                
                                // If still failing, try manual extraction
                                if (!parsedContent && msg.content.includes('"section"')) {
                                  try {
                                    // Extract JSON by finding the first { and last }
                                    const firstBrace = msg.content.indexOf('{');
                                    const lastBrace = msg.content.lastIndexOf('}');
                                    
                                    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                                      const jsonSubstring = msg.content.substring(firstBrace, lastBrace + 1);
                                      parsedContent = debugJsonParse(jsonSubstring);
                                    }
                                  } catch (e) {
                                    console.error('Message rendering - Manual extraction failed:', e);
                                  }
                                }
                              }
                            }
                            
                            // If we successfully parsed the JSON, render it with SyntherionResponse
                            if (parsedContent) {
                              return <SyntherionResponse data={parsedContent} animate={false} />;
                            } else {
                              // Fallback to plain text rendering
                              return (
                                <div className="px-4 py-2 rounded-2xl whitespace-pre-line break-words text-base shadow-sm bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white rounded-bl-md">
                                  {msg.content}
                                </div>
                              );
                            }
                          })()
                        ) : (
                          <div className="px-4 py-2 rounded-2xl whitespace-pre-line break-words text-base shadow-sm bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white rounded-bl-md">
                            {msg.content}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white animate-pulse shadow-sm rounded-bl-md max-w-[80%]">
                    Writing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              className="p-3 sm:p-4 border-t border-border bg-white/70 dark:bg-zinc-900/70 rounded-b-3xl flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                rows={1}
                placeholder="Type your message..."
                className="flex-1 resize-none text-black dark:text-white bg-background/90 placeholder:text-gray-400 dark:placeholder:text-gray-300"
                disabled={loading}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                onBlur={() => setUserBlurred(true)}
                onFocus={() => setUserBlurred(false)}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                variant="default"
                size="icon"
                className="rounded-full"
              >
                <BotMessageSquare className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
