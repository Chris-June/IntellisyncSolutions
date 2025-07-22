// src/lib/streamModelResponse.ts

/**
 * Streams OpenAI API chat responses using the backend's session-aware endpoint.
 * 
 * - Always uses the backend's official Syntherion system prompt (does NOT send a custom system prompt from the frontend).
 * - Maintains conversation context via sessionId stored in localStorage.
 * - Optionally sends page/event context for enhanced relevance.
 * - Handles streaming, session management, and chunked response assembly.
 *
 * @param userPrompt - The user's input message.

 * @param eventContext - Optional string describing the user's current page or context.
 * @returns The streamed AI response as a string.
 */

export async function streamModelResponse(userPrompt: string, eventContext?: string): Promise<string> {
  const controller = new AbortController();
  
  // We'll let the server use its DEFAULT_SYSTEM_PROMPT instead of sending our own
  // This ensures the official Syntherion persona is consistently used
  const messages = [
    // We don't send a system prompt from frontend - server will use its default
    { role: 'user', content: userPrompt }
  ];
  
  // Add event message if context is provided
  if (eventContext) {
    messages.push({ role: 'event', content: eventContext });
  }
  // Get sessionId from localStorage if available
  let sessionId = null;
  if (typeof window !== 'undefined') {
    sessionId = localStorage.getItem('ai-chat-session-id');
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const response = await fetch(`${apiBaseUrl}/api/ai/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      messages,
      sessionId,
      // Server will use its default temperature and token limits.
    }),
    signal: controller.signal,
  });
  if (!response.body) throw new Error('No response body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    chunk.split('\n').forEach(line => {
      // Handle session events
      if (line.startsWith('event: session')) {
        // The next line should contain the session data
        const nextLine = chunk.split('\n').find(l => l.startsWith('data: ') && l.includes('sessionId'));
        if (nextLine) {
          try {
            const sessionData = JSON.parse(nextLine.replace('data: ', ''));
            if (sessionData && sessionData.sessionId) {
              // Store the session ID for future requests
              localStorage.setItem('ai-chat-session-id', sessionData.sessionId);
              console.log('Saved session ID:', sessionData.sessionId);
            }
          } catch (error) {
            console.error('Error parsing session data:', error);
          }
        }
      }
      // Handle regular data events
      else if (line.startsWith('data: ')) {
        try {
          const content = JSON.parse(line.replace('data: ', ''));
          // Make sure we're only adding string content
          if (typeof content === 'string') {
            result += content;
          } else if (content && typeof content === 'object') {
            // If it's an object, handle it properly (likely a session or done event)
            console.log('Received object in stream:', content);
            // Don't add objects to the result string
          }
        } catch (error) {
          console.error('Error parsing chunk:', error);
        }
      }
    });
  }
  return result;
}
