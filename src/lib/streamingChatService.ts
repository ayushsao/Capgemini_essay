// Real-time streaming AI service for chatbot
// Using Server-Sent Events (SSE) for real-time responses

interface StreamingResponse {
  chunk: string;
  isComplete: boolean;
  error?: string;
}

// Free AI APIs that support streaming
const AI_ENDPOINTS = {
  // Ollama (Local/Free) - Be  default: "🎓 **Welcome to Essaytude!**\n\nI'm your expert writing assistant, ready to help you excel! I can provide guidance on:\n\n✍️ **Essay Structure** - thesis, organization, flow\n📝 **Grammar & Style** - clarity, voice, mechanics\n🔍 **Research & Citations** - sources, plagiarism prevention\n🤖 **Authenticity** - original writing, AI detection tips\n💡 **Creative Development** - brainstorming, analysis\n\n**What writing challenge can I help you tackle today?**"t for real-time
  ollama: {
    url: 'http://localhost:11434/api/generate',
    model: 'llama3.2:1b', // Lightweight model
    streaming: true
  },
  
  // Groq (Free tier with streaming)
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama3-8b-8192',
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
  },

  // Together AI (Free tier)
  together: {
    url: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.2-1B-Instruct-Turbo',
    apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY || ''
  }
};

const ESSAY_PROMPT = `You are an expert Essay Writing Coach and Academic Mentor from Essaytude. You help students achieve writing excellence through personalized guidance.

EXPERTISE AREAS:
🎯 Essay Structure: Thesis development, paragraph organization, logical flow
📝 Writing Techniques: Hook creation, argumentation, evidence integration
📚 Academic Standards: APA/MLA citation, formal tone, academic voice  
🔍 Quality Assurance: Grammar, clarity, coherence, style consistency
💡 Creative Development: Brainstorming, topic analysis, critical thinking
🛡️ Academic Integrity: Plagiarism prevention, AI detection awareness, original thinking

RESPONSE STYLE:
- Be encouraging and supportive while maintaining high standards
- Provide specific, actionable advice with examples
- Use bullet points and emojis for clarity and engagement  
- Keep responses comprehensive but under 200 words
- Include practical tips students can implement immediately
- Reference writing frameworks and proven techniques
- Always end with a motivational or confidence-building statement

Focus on helping students become independent, confident writers who understand both the craft and ethics of academic writing.`;

// Stream response from Ollama (Local AI)
export async function streamOllamaResponse(
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch(AI_ENDPOINTS.ollama.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_ENDPOINTS.ollama.model,
        prompt: `${ESSAY_PROMPT}\n\nUser: ${message}\nAssistant:`,
        stream: true,
        options: {
          temperature: 0.7,
          max_tokens: 150,
          stop: ['User:', '\n\n']
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama not available');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              onChunk(data.response);
            }
            if (data.done) {
              onComplete();
              return;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(`Ollama error: ${error}`);
  }
}

// Stream response from Groq
export async function streamGroqResponse(
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  if (!AI_ENDPOINTS.groq.apiKey) {
    onError('Groq API key not configured');
    return;
  }

  try {
    const response = await fetch(AI_ENDPOINTS.groq.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_ENDPOINTS.groq.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_ENDPOINTS.groq.model,
        messages: [
          { role: 'system', content: ESSAY_PROMPT },
          { role: 'user', content: message }
        ],
        stream: true,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onComplete();
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(`Groq streaming error: ${error}`);
  }
}

// Stream response from Together AI
export async function streamTogetherResponse(
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  if (!AI_ENDPOINTS.together.apiKey) {
    onError('Together AI API key not configured');
    return;
  }

  try {
    const response = await fetch(AI_ENDPOINTS.together.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_ENDPOINTS.together.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_ENDPOINTS.together.model,
        messages: [
          { role: 'system', content: ESSAY_PROMPT },
          { role: 'user', content: message }
        ],
        stream: true,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together AI error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onComplete();
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(`Together AI streaming error: ${error}`);
  }
}

// Smart fallback with typing simulation
export async function simulateTypingResponse(
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): Promise<void> {
  // Intelligent responses based on keywords
  let response = '';
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('grammar') || lowerMessage.includes('mistake') || lowerMessage.includes('error')) {
    response = "🔍 **Grammar Excellence Guide:**\n\n✅ **Core Rules:** Subject-verb agreement, proper punctuation, parallel structure\n📝 **Common Fixes:** Avoid run-ons, fix comma splices, use active voice\n🎯 **Pro Tips:** Read aloud, use Grammarly, check apostrophes in contractions\n💡 **Quick Check:** Does each sentence have a clear subject and verb?\n\n**Remember:** Good grammar builds credibility and clarity in your writing!";
  } else if (lowerMessage.includes('structure') || lowerMessage.includes('organize') || lowerMessage.includes('paragraph')) {
    response = "🏗️ **Essay Structure Mastery:**\n\n📖 **Introduction:** Hook + Background + Clear Thesis Statement\n📝 **Body Paragraphs:** Topic Sentence + Evidence + Analysis + Transition\n🎯 **Conclusion:** Restate thesis + Summarize key points + Call to action\n💡 **PEEL Method:** Point, Evidence, Explain, Link for strong paragraphs\n\n**Pro Tip:** Each paragraph = one main idea. Outline first, then write!";
  } else if (lowerMessage.includes('plagiarism') || lowerMessage.includes('copy') || lowerMessage.includes('citation')) {
    response = "🛡️ **Academic Integrity Guide:**\n\n📚 **Citation Basics:** APA/MLA for sources, quotation marks for direct quotes\n✍️ **Paraphrasing:** Rewrite in your own words + cite original source\n🔍 **When to Cite:** Facts, statistics, quotes, ideas from others\n💡 **Reference Tools:** Use Zotero, EndNote, or built-in citation managers\n\n**Golden Rule:** When in doubt, cite it out! Our plagiarism checker helps ensure originality.";
  } else if (lowerMessage.includes('ai') || lowerMessage.includes('detect') || lowerMessage.includes('original')) {
    response = "🤖 **AI Detection & Authenticity:**\n\n✨ **Write Authentically:** Use personal experiences, unique perspectives, original insights\n🎨 **Vary Style:** Mix short/long sentences, use your natural voice and vocabulary\n💭 **Add Value:** Include questions, analysis, personal connections to topics\n🔍 **Detection Tips:** Our AI checker identifies robotic patterns vs human creativity\n\n**Key:** Authentic writing comes from your thoughts, experiences, and unique viewpoint!";
  } else if (lowerMessage.includes('thesis') || lowerMessage.includes('argument') || lowerMessage.includes('claim')) {
    response = "🎯 **Thesis Statement Mastery:**\n\n💡 **Strong Thesis:** Clear position + 2-3 main supporting points\n📝 **Formula:** 'Although [opposing view], [your position] because [reason 1], [reason 2], and [reason 3]'\n🎪 **Placement:** End of introduction paragraph for maximum impact\n✅ **Test:** Can someone disagree? Is it specific and arguable?\n\n**Example:** 'Social media harms teens through cyberbullying, sleep disruption, and comparison culture.'";
  } else if (lowerMessage.includes('introduction') || lowerMessage.includes('hook') || lowerMessage.includes('start')) {
    response = "🎪 **Powerful Introduction Guide:**\n\n🎣 **Hook Options:** Surprising statistic, thought-provoking question, relevant quote, bold statement\n📖 **Background:** 2-3 sentences providing context for your topic\n🎯 **Thesis:** Clear, arguable statement that previews your main points\n💡 **Flow:** Hook → Context → Thesis (like a funnel: broad to specific)\n\n**Pro Tip:** Start with your strongest hook idea - first impressions matter!";
  } else if (lowerMessage.includes('conclusion') || lowerMessage.includes('ending') || lowerMessage.includes('finish')) {
    response = "🏁 **Conclusion Excellence:**\n\n🔄 **Restate Thesis:** Same meaning, different words than introduction\n📋 **Summarize:** Briefly recap your main supporting points\n🚀 **Call to Action:** What should readers think/do next?\n❌ **Avoid:** New information, weak phrases like 'in conclusion'\n\n**Strong Ending:** Leave readers convinced and inspired to act on your argument!";
  } else {
    response = "🎓 **Welcome to Writers Choice AI Assistant!**\n\nI'm here to help you excel at essay writing! I can assist with:\n\n✍️ **Structure & Organization** - thesis, paragraphs, flow\n📝 **Grammar & Style** - clarity, voice, mechanics  \n🔍 **Research & Citations** - sources, plagiarism prevention\n🤖 **AI Detection** - authenticity and originality\n💡 **Creative Development** - brainstorming, analysis\n\n**What would you like to work on today?** Just ask about any aspect of writing!";
  }

  // Simulate realistic typing speed
  const words = response.split(' ');
  let currentText = '';
  
  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? ' ' : '') + words[i];
    onChunk(words[i] + (i < words.length - 1 ? ' ' : ''));
    
    // Vary typing speed for realism
    const delay = Math.random() * 100 + 50; // 50-150ms per word
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  onComplete();
}

// Main streaming function with fallback chain
export async function getStreamingResponse(
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  console.log('🚀 Starting streaming response for:', message);

  // Try services in order of preference
  const services = [
    { name: 'Ollama', fn: streamOllamaResponse },
    { name: 'Groq', fn: streamGroqResponse },
    { name: 'Together', fn: streamTogetherResponse }
  ];

  for (const service of services) {
    try {
      console.log(`🔄 Trying ${service.name}...`);
      await service.fn(message, onChunk, onComplete, (error) => {
        console.log(`❌ ${service.name} failed:`, error);
        throw new Error(error);
      });
      console.log(`✅ ${service.name} succeeded!`);
      return; // Success, exit
    } catch (error) {
      console.log(`⏭️ ${service.name} failed, trying next...`);
      continue;
    }
  }

  // All services failed, use smart fallback
  console.log('📝 Using smart fallback with typing simulation');
  await simulateTypingResponse(message, onChunk, onComplete);
}

// Check available services
export function getAvailableStreamingServices(): string[] {
  const services = [];
  
  // Check if Ollama is running (local)
  services.push('Ollama (Local AI)');
  
  if (AI_ENDPOINTS.groq.apiKey) {
    services.push('Groq (Llama 3)');
  }
  
  if (AI_ENDPOINTS.together.apiKey) {
    services.push('Together AI (Llama 3.2)');
  }
  
  services.push('Smart Fallback (Always Available)');
  
  return services;
}
