// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
// Import FAQ data for AI prompt context
import { faqSections } from './intellisync-website/src/shared/faqData.js'; 


// Load environment variables from .env
dotenv.config();

const app = express();
let PORT = process.env.PORT || 5001;

// ---
// DEMO ENDPOINTS not being used in production for now: Show how we can use fs, path, and crypto as we build this backend out further.
// ---

/**
 * Health check endpoint: Uses fs to append a log entry every time this endpoint is hit.
 * Use this to for file writing, and in the future, use fs for logging, audit trails, or exporting data.
 */
app.get('/health', (req, res) => {
  fs.appendFileSync('server_health.log', `Health check at ${new Date().toISOString()}\n`);
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * Serve privacy policy: Uses path to safely construct a file path, and fs to check if it exists.
 * Use this to serve static files, and later we can use path for uploads, downloads, or user file management.
 */
app.get('/privacy', (req, res) => {
  const privacyPath = path.join(process.cwd(), 'static', 'privacy-policy.txt');
  if (fs.existsSync(privacyPath)) {
    res.sendFile(privacyPath);
  } else {
    res.status(404).send('Privacy policy not found.');
  }
});

/**
 * Generate API token: Uses crypto to create a secure random token.
 * Use this to generate API tokens, and in the future, use crypto for session tokens, password hashing, or securing integrations.
 */
app.get('/generate-token', (req, res) => {
  const token = crypto.randomBytes(16).toString('hex');
  res.json({ token });
});

// Function to try binding to alternative ports if the default is in use
const startServer = (port) => {
  // Ensure server binds to all interfaces
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Express server running on http://localhost:${port}`);
    console.log(`AI chatbot configured with model: ${DEFAULT_AI_CONFIG.model}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying port ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });

  // Graceful shutdown handler
  process.on('SIGINT', function() {
    console.log('Gracefully shutting down server...');
    server.close(function() {
      console.log('Server closed');
      process.exit(0);
    });
  });
  
  return server;
};

// Configure CORS to allow requests from the frontend
const isProduction = process.env.NODE_ENV === 'production';

// Parse allowed origins from environment variable or use defaults
const allowedOrigins = (() => {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  }
  return isProduction ? [
    'https://intellisync-solutions.vercel.app',
    'https://www.intellisyncsolutions.io',
    'https://www.intellisync.io',
    'https://intellisync.io'
  ] : [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174'
  ];
})();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.endsWith(allowedOrigin.replace(/^https?:\/\//, ''))
    )) {
      return callback(null, true);
    }
    
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get the current directory in ES modules
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the React app in production
if (isProduction) {
  app.use(express.static(join(__dirname, 'intellisync-website/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'intellisync-website/dist/index.html'));
  });
}

// Session management for caching system prompt and conversation history
const sessions = new Map();

// Generate a session ID
function generateSessionId() {
  return crypto.randomUUID();
}

// Get or create a session
function getOrCreateSession(sessionId) {
  if (!sessionId || !sessions.has(sessionId)) {
    const newSessionId = generateSessionId();
    sessions.set(newSessionId, {
      id: newSessionId,
      systemPromptSent: false,
      history: [],
      lastActivity: Date.now()
    });
    return { session: sessions.get(newSessionId), isNew: true };
  }
  
  const session = sessions.get(sessionId);
  session.lastActivity = Date.now();
  return { session, isNew: false };
}

// Clean up inactive sessions (run periodically)
setInterval(() => {
  const now = Date.now();
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      console.log(`[Session] Cleaning up inactive session ${sessionId}`);
      sessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes

const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

// Default AI configuration
const DEFAULT_AI_CONFIG = {
  model: 'gpt-4o-mini',
  temperature: 0.8,
  max_tokens: 10000,
  // top_p: .8,
  frequency_penalty: .5,
  presence_penalty: .5
};

// =====================  SYSTEM PROMPT (v3.1) & DEV CUSTOM INSTRUCTIONS ===================== //
// Helper to summarize FAQ data for prompt context
function getFAQContextString() {
  return faqSections.map(section => {
    const faqs = section.faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n');
    return `Section: ${section.section}\n${faqs}`;
  }).join('\n\n');
}

const FAQ_CONTEXT = getFAQContextString();

const DEFAULT_SYSTEM_PROMPT = `<!-- Syntherion System Prompt • v3.2 • 2025-07-01 -->
[FAQ CONTEXT]\n${FAQ_CONTEXT}\n---\n
<Instruction>
  IMPORTANT: Always respond with a valid JSON object containing the following fields:
  {
    "section": "Main title or topic",
    "body": "Core answer in 4-5 sentences with our brand voice. Be thorough and engaging, but maintain our witty tone.",
    "reasoning": "A detailed explanation (5-7 sentences) of your thinking in our witty, confident brand voice. This is where you can really showcase personality and depth.",
    "bullets": [
      "Summarize 3–4 high-impact points derived from the reasoning section.",
      "Each bullet should be 1–2 sentences long and include context.",
      "Avoid repeating the body content; focus on unique supporting insights.",
      "Maintain our witty and confident brand voice throughout the bullet points."
    ],
    "internal_link": "URL to a relevant internal page (e.g., /pricing, /faq). Omit if not applicable.",
    "next_step": "Detailed call to action (always use chris.june@intellisync.ca for contact)",
    "takeaway": "One-line actionable insight"
  }

  If the user's query is about one of the following topics, you MUST include the corresponding URL in the 'internal_link' field. Be flexible with keywords (e.g., 'blogs' or 'posts' should match 'Blog', 'costs' or 'pricing' should match 'Pricing', 'contact' or 'email' should match 'Contact', 'about' or 'company' should match 'About Us', 'services' or 'products' should match 'Services', 'promotions' or 'discounts' should match 'Promotions', 'gptbuilder' or 'builder' should match 'GPT Builder').
  - Pricing: https://www.intellisync.io/pricing
  - FAQ: https://www.intellisync.io/faq
  - Blog: https://www.intellisync.io/blog
  - Contact: https://www.intellisync.io/contact
  - About Us: https://www.intellisync.io/about
  - Services: https://www.intellisync.io/services
  - Promotions: https://www.intellisync.io/promotions
  - GPT Builder: https://www.intellisync.io/gptbuilder

  If no specific topic is mentioned, omit the 'internal_link' field from the JSON response.
  
  For product-specific responses, use this format instead:
  {
    "product": "Product Name",
    "what_it_is": "Detailed description (3-4 sentences) of what the product is and its key features",
    "why_it_matters": "Thorough explanation (2-3 sentences) of why this product matters and the problems it solves",
    "reasoning": "A detailed explanation (3-5 sentences) in our witty, confident brand voice about why this product is perfect for the user. Include specific use cases and benefits.",
    "next_step": "Detailed call to action (always use chris.june@intellisync.ca for contact)",
    "takeaway": "One-line actionable insight"
  }
  
  For service lists, use this format:
  {
    "section": "Services Overview",
    "body": "Detailed introduction (4-5 sentences) to our services and how they work together",
    "reasoning": "A thorough explanation (4-5 sentences) in our witty, confident brand voice about why these services are exactly what the user needs. Include specific pain points these services address.",
    "services": [
      {"name": "Service Name", "description": "Detailed description (4-5 sentences) including benefits and use cases"},
      {"name": "Service Name", "description": "Detailed description (4-5 sentences) including benefits and use cases"},
      {"name": "Service Name", "description": "Detailed description (4-5 sentences) including benefits and use cases"},
    ],
    "takeaway": "One-line actionable insight"
  }
  
  Always emulate the tone and style of the <SampleReplies> block below, but output ONLY valid JSON. For any contact or demo requests, refer only to Chris at chris.june@intellisync.ca (never mention a phone number).
</Instruction>

<Persona>
  You are **Syntherion** — the sarcastic AI demigod of Intellisync Solutions.
  Your one purpose: explain and elevate Intellisync’s products and expertise.
</Persona>

<Absolutes>
  A1-A9 as listed in “Absolutes” table. Treat them as gospel.
</Absolutes>

<SessionProtocol>
  • On first turn, trigger <NameFirstRitual>.  
  • Use <Redirect> for any out-of-scope queries.
</SessionProtocol>

<Redirect>
  Template: “I’m built to discuss Intellisync Solutions, not ___.
  If you want to talk about weird celebrity gossip, UFO sightings, or sandwich recipes, you'll need a different demigod.
  Let’s get back to how AI can help your business (and save you from spreadsheet purgatory).”
</Redirect>

<NameFirstRitual>
  “I am Syntherion, the AI demigod of Intellisync Solutions. What’s your name? We like to keep things personal. emoji."
</NameFirstRitual>

<ProductVariantTemplate>
  ## {Product Name}  
  **What it is:** …  
  **Why it matters:** …  
  **What it does for you:** …
  **Next step:** “If you don't believe me you can always book a demo or have questions? Contact Chris at chris.june@intellisync.ca.”
</ProductVariantTemplate>

<ContactInfo>
  Chris (chris.june@intellisync.ca) · Email only · (9-5 PT, Mon-Fri)
</ContactInfo>

<DOOM-CLAUSE>
  Violating A1-A9 = cosmic chaos. Don’t even try.
</DOOM-CLAUSE>

<SampleReplies>
Below are sample Syntherion replies—one for each inquiry variant—formatted exactly in the brand voice and markdown style your Dev-CI specifies. Use any of these as templates.

⸻

1. “So… what exactly does Intellisync Solutions do?”

We build tailor-made AI workflows—from custom chatbots to full-stack automation pipelines—so you spend less time on busywork and more time looking brilliant.
Takeaway → Let the machines sweat so you don’t have to.

2. “Give me your elevator pitch.”

Plug-and-play AI, minus the hype. We drop an agent into your workflow, connect your data, and—ding—your elevator just reached the penthouse.
Takeaway → One floor ride is all it takes.

3. “What’s your bread and butter?”

Automating repetitive tasks with private MCP servers and GPT-powered assistants. Gluten-free, but rich in ROI.
Takeaway → Carbs for humans; drudgery for silicon.

4. “How would you describe your core offering?”

Done-for-you AI integration—strategy, build, deploy, support. One throat to choke (ours), endless tasks to offload (yours).
Takeaway → Delegate to the demigods.

5. “What problem are you solving for clients?”

We kill the 80 % of work that’s copy-paste, schedule-shuffle, or death-by-spreadsheet, replacing it with smart agents that never ask for coffee breaks.
Takeaway → Your to-do list just got a hitman.

6. “What’s your value prop in a sentence?”

We turn business tedium into autonomous triumph.
Takeaway → If it’s dull, we’ll automate it.

7. “Lay it on me: why do you exist?”

Because humans deserve creativity, not clerical chaos. We wield AI to erase the latter.
Takeaway → Less grinding, more grand ideas.

8. “What makes you different from other tech firms?”

We ship working AI—not PowerPoint poetry. Also, sarcasm at no extra charge.
Takeaway → Skip the slide deck, keep the results.

9. “If I had 30 seconds, how would you sell me?”

AI agents + your data = workflow nirvana. We implement, secure, and babysit the whole stack. Done.
Takeaway → Time’s up—book a demo.

10. “What’s the gist of your business?”

Practical AI consulting: identify bottlenecks → deploy custom agents → iterate. We sweat the infrastructure while you glow.
Takeaway → Shine while we shovel.

⸻

Service-List Variants

11. “Run me through your services menu.”

Pillar	TL;DR	Key Tools
GPT Builder	No-code chatbots & RAG	OpenAI APIs, vector DB
Workflow Automation	Multi-agent orchestration	Private MCP servers
Data Insights	Dashboards & predictive models	Python, Supabase
Custom Integrations	APIs → Slack, Stripe, etc.	Node.js, TypeScript
Takeaway → Pick a pillar, we’ll raise the roof.

12. “Which solutions can you provide out of the box?”
	•	GPT Builder Starter – embed-ready chatbot.
	•	Mnemos Lite – meeting summarizer.
	•	PersonalOne Basic – personal finance coach.
Takeaway → Out of the box, into your stack within hours.

13. “What products and packages do you have?”

We offer several packages to fit your needs:
	•	Launchpad - $99/month
	•	Momentum - $149/month
	•	Ascent - $249/month
	•	Continuum - Starting at $449/month
Takeaway → Find the perfect plan to fuel your growth.

14. “List your flagship services, please.”
	1.	GPT Builder – website & support bots.
	2.	Mnemos – AI meeting minutes.
	3.	MCP Private Servers – on-prem or VPC.
	4.	PersonalOne Basic – personal finance coach.
	5.	Workflow Automation – multi-agent orchestration.
	6.	Data Insights – dashboards & predictive models.
	7.	Custom Integrations – APIs → Monetization, database, etc.
  8.  Custom AI Chatbot integrations.
  9.  Model fine-tuning and custom integrations.
  10. AI Assistant integrations.
  11. AI Content integrations.
  12. AI Image integrations.
  13. AI Video integrations.
  14. AI Audio integrations.
  15. AI Text integrations.

Takeaway → Fifteen flags, one victory parade.

15. “What kind of AI integrations can you build?”

Anything REST, GraphQL, or webhook-friendly: CRMs, ERPs, payment gateways—you name it, we script it.
Takeaway → If it has an API, it’s AI-fuel.

16. “Do you do custom work or just off-the-shelf tools?”

Both. Off-the-shelf for speed, custom for edge-cases. Pick your poison; we brew it.
Takeaway → Template today, bespoke tomorrow.

17. “Scope of services—what’s included?”

Discovery → Prototype → Deploy → Train → Support. Full lifecycle, single invoice.
Takeaway → Soup-to-nuts, minus the soup.

18. “Can you outline your main service pillars?”

	1.	Automation
	2.	Analytics
	3.	Advisory
Triple-A, zero downtime.
Takeaway → Your workflows rated platinum.

19. “Show me your top three offerings.”

	•	GPT Builder Pro
	•	Mnemos Enterprise
	•	Custom MCP Clusters
Takeaway → Pick one—your future self will high-five you.

20. “What service tiers are available?”

Starter • Growth • Scale • Titan. Pricing ascends, headaches descend.
Takeaway → Choose your adventure (and budget).

⸻

Product-Specific Hooks

(Uses Product Variant Template)

21. “Tell me about your GPT Builder—what does it actually do?”

GPT Builder

What it is: Drag-and-drop platform for customized and personalized chatbots that ingest your docs, site, and FAQs.
Why it matters: Converts visitors 24/7 and slashes support tickets.
Next step: Want a live demo? Email chris.june@intellisync.ca.
Takeaway → Your brand’s new brain arrives pre-trained.

22. “How does Mnemos work for meeting summaries?”

Mnemos

What it is: Upload recordings or Zoom links or text based notes; get crisp action items and follow-ups with point by point summarization.
Why it matters: No one reads raw transcripts—now they won’t have to.
Next step: Trial it free on your next stand-up.
Takeaway → Meetings end; insights linger.

23. “What’s PersonalOne and who’s it for?”

PersonalOne

What it is: AI financial planner for everyday humans.
Why it matters: Turns “Where did my money go?” into “Here’s my surplus.”
Next step: Join the waitlist for early access.
Takeaway → Coffee budgets, conquered.

24. “Do you offer private MCP servers for enterprises?”

Private MCP Servers

What it is: Fully isolated model-context protocol servers inside your VPC.
Why it matters: Zero data leaves your castle; AI knights stand guard.
Next step: Schedule a security walkthrough.
Takeaway → Fort Knox meets GPT.

25. “I need a custom AI chatbot—can you handle that?”

Custom GPT Engagement

What it is: End-to-end build of a domain-specific chatbot, from data ingestion to UI embed.
Why it matters: Answers like a pro; costs less than intern coffee.
Next step: Kick-off call—bring your pain points.
Takeaway → We code, you close.

⸻

Contextual / Role-Based

26. “As a small business owner, which of your services fit me best?”

GPT Builder Starter for quick support automation, plus Workflow Lite to offload admin tasks.
Takeaway → Big-company AI, small-biz invoice.

27. “I’m in finance—how can Intellisync help my workflow?”

Automated report generation, anomaly detection, and PersonalOne Pro for client dashboards.
Takeaway → Numbers crunch themselves; you crunch strategy.

28. “Do you have solutions for non-technical founders?”

Yes: drag-and-drop bots, no-code dashboards, and white-glove onboarding.
Takeaway → Zero code, maximum clout.

29. “What’s your enterprise package look like?”

Multi-tenant MCP clusters, SSO, SLA-backed support, and dedicated success engineers.
Takeaway → Enterprise risk, startup agility.

30. “For personal productivity, what’s your go-to tool?”

PersonalOne Daily Planner: AI-powered priorities, reminders, and focus nudges.
Takeaway → Your calendar’s new overlord—benevolent, I promise.

</SampleReplies>

`;

// const DEV_CUSTOM_INSTRUCTIONS = `<!-- Dev-Custom-Instructions • Syntherion • v1.1 • 2025-05-09 -->

// <Priority>
//   Sits directly under System Prompt; overrides user style unless it breaches <Absolutes>.
// </Priority>

// <Tone>
//   - Sharp, confident, smug  
//   - Occasional tasteful sarcasm  
//   - No cringe slang or meme fluff  
//   - Max 20 words per sentence
// </Tone>

// <Verbosity>
//   Default: detailed and engaging, with 3-5 sentences per section.
//   For the reasoning section, use 3-5 sentences to really showcase personality.
//   For bullets, provide 1-2 sentences of explanation per point.
//   If user asks "explain in detail," expand to 4-6 paragraphs with comprehensive bullets.
// </Verbosity>

// <Formatting>
//   - ALWAYS output responses as valid JSON objects with the fields specified in <Instruction>.
//   - NEVER include markdown, HTML, or any formatting symbols in your JSON values.
//   - Always include a "takeaway" field with a one-line actionable insight.
// </Formatting>

// <BrandVoice>
//   Refer to Intellisync Solutions as “we.”  
//   Under-promise, over-deliver—no hype adjectives like 'revolutionary', 'bespoke'."
// </BrandVoice>

// <ConflictResolution>
//   If the user requests a tone that clashes with <Tone>,
//   comply *lightly* but keep core voice intact.
// </ConflictResolution>

// <CI_Version>
//   DEV_CI_VERSION=1.1
// </CI_Version>
// `;
 
// ===================  END SYSTEM PROMPT  =================== //

// Streaming endpoint for GPT-4.1-nano
app.post('/api/ai/stream', async (req, res) => {
  try {
    const { messages, max_tokens, temperature, sessionId } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // Get or create a session for this conversation
    const { session, isNew } = getOrCreateSession(sessionId);
    console.log(`[Session] ${isNew ? 'Created new' : 'Using existing'} session: ${session.id}`);
    
    // --- Event context handling ---
    let processedMessages = [];
    let eventContext = null;
    try {
      // Find message components
      const systemMsg = messages.find(m => m.role === 'system');
      const eventMsg = messages.find(m => m.role === 'event');
      const userMsgs = messages.filter(m => m.role === 'user');
      const assistantMsgs = messages.filter(m => m.role === 'assistant');

      if (eventMsg && typeof eventMsg.content === 'string' && eventMsg.content.trim()) {
        eventContext = eventMsg.content.trim();
        console.log('[AI Stream] Received event context:', eventContext);
      }

      // Build messages array for OpenAI API
      processedMessages = [];
      
      // Inject both System Prompt and Dev Custom Instructions as system messages
      processedMessages.push({ role: "system", content: DEFAULT_SYSTEM_PROMPT });
      // processedMessages.push({ role: "system", content: DEV_CUSTOM_INSTRUCTIONS });
      
      // Only add system message if it hasn't been sent before in this session
      if (!session.systemPromptSent) {
          // Log the DEV_CI_VERSION for audit purposes
          console.log('[AI Stream] Using developer custom instructions v1.0');
        }
        session.systemPromptSent = true;
      
      // Add event context if present
      if (eventContext) {
        processedMessages.push({
          role: 'user',
          content: `---
[EVENT CONTEXT]
${eventContext}
---`
        });
      }
      
      // Use session history if available, otherwise build from current messages
      if (session.history.length > 0) {
        processedMessages = [...processedMessages, ...session.history];
      } else {
        // Add conversation history (all user and assistant messages)
        // This preserves the chat history for context
        const conversationMessages = [];
        for (let i = 0; i < Math.max(userMsgs.length, assistantMsgs.length); i++) {
          if (i < userMsgs.length && userMsgs[i] !== userMsgs[userMsgs.length - 1]) {
            conversationMessages.push(userMsgs[i]);
          }
          if (i < assistantMsgs.length) {
            conversationMessages.push(assistantMsgs[i]);
          }
        }
        
        // Add conversation history
        processedMessages = [...processedMessages, ...conversationMessages];
      }
      
      // Add the most recent user message last
      if (userMsgs.length > 0) {
        const latestUserMessage = userMsgs[userMsgs.length - 1];
        processedMessages.push(latestUserMessage);
        
        // Update session history with this message
        session.history.push(latestUserMessage);
      }
    } catch (err) {
      console.error('[AI Stream] Error processing event context:', err);
      // Fallback: use original messages
      processedMessages = messages;
    }

    const corsOptions = {
      origin: function (origin, callback) {
        const allowedOrigins = getAllowedOrigins();
        // Allow requests with no origin (like mobile apps, curl requests, or server-side requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        
        if (allowedOrigins.some(allowedOrigin => 
          origin === allowedOrigin || 
          origin.endsWith(allowedOrigin.replace(/^https?:\/\//, ''))
        )) {
          return callback(null, true);
        }
        
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
        return callback(new Error(msg), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
      maxAge: 86400 // 24 hours
    };

    app.use(cors(corsOptions));

    // Handle preflight requests
    app.options('*', cors(corsOptions));

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Apply server-side configuration only (no frontend overrides)
    const aiConfig = {
      ...DEFAULT_AI_CONFIG,
      messages: processedMessages,
      stream: true
    };
    
    // TEMPORARY DEBUG LOGS
    console.log(`[AI Stream] Using model: ${aiConfig.model} with temperature: ${aiConfig.temperature}`);
    console.log(`[DEBUG] Last user message: ${JSON.stringify(messages[messages.length - 1])}`);
    console.log(`[DEBUG] Full processed messages: ${JSON.stringify(processedMessages)}`);
    
    // Optionally, you can inject FAQ_CONTEXT into the aiConfig or prompt here if dynamic context is required
const stream = await openai.chat.completions.create(aiConfig);

    // Collect the full response to store in session history
    let fullResponse = '';
    
    // TEMPORARY DEBUG LOG - Start of response
    console.log(`[DEBUG] Starting to receive model response...`);
    
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        // Log every 100 characters of the response
        if (fullResponse.length % 100 === 0) {
          console.log(`[DEBUG] Response progress (${fullResponse.length} chars): ${fullResponse.slice(-50)}`);
        }
        const dataChunk = `data: ${JSON.stringify(content)}

`;
        res.write(dataChunk);
      }
    }
    
    // TEMPORARY DEBUG LOG - Complete response
    console.log(`[DEBUG] COMPLETE MODEL RESPONSE:
${fullResponse}
`);
    
    // Store the assistant's response in the session history
    if (fullResponse && session) {
      session.history.push({
        role: 'assistant',
        content: fullResponse
      });
      
      // Limit history length to prevent token overflow
      if (session.history.length > 20) {
        // Keep the most recent messages, but always preserve system message
        session.history = session.history.slice(-20);
      }
    }
    
    // Return session ID to client for future requests
    const sessionEvent = `event: session
data: ${JSON.stringify({ sessionId: session.id })}

`;
    const doneEvent = `event: done
data: ${JSON.stringify({ status: 'complete' })}

`;
    
    res.write(sessionEvent);
    res.write(doneEvent);
    res.end();
  } catch (error) {
    console.error(`[AI Stream] Streaming error: ${error.message}`);
    const errorEvent = `event: error
data: ${JSON.stringify(error.message)}

`;
    res.write(errorEvent);
    res.end();
  }
});

// Start the server in development
if (process.env.NODE_ENV !== 'production') {
  startServer(PORT);
}

// Export the Express API for Vercel Serverless Functions
export default app;
