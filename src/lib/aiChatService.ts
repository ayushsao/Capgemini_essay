// AI API service for chatbot
// Using multiple free AI APIs as fallbacks

interface AIResponse {
  text: string;
  success: boolean;
  source: string;
}
import { siteConfig } from '@/config/metadata';

// Groq API (Free tier available)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

// Hugging Face API (Free tier)
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY || '';

// OpenRouter API (Free tier)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';

// System prompt for essay writing assistant
const SYSTEM_PROMPT = `You are an AI Essay Writing Assistant. You help students improve their writing skills by providing:
1. Grammar and spelling corrections
2. Essay structure guidance
3. Writing tips and techniques
4. Plagiarism prevention advice
5. AI detection awareness

Keep responses concise, helpful, and educational. Focus on essay writing, grammar, and academic integrity.`;

// Try Groq API first (fastest and most reliable free option)
async function tryGroqAPI(message: string): Promise<AIResponse> {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here' || GROQ_API_KEY.length < 10) {
    return { text: '', success: false, source: 'groq' };
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Updated model name
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.choices[0]?.message?.content || '',
        success: true,
        source: 'groq'
      };
    }
  } catch (error) {
    console.log('Groq API failed:', error);
  }

  return { text: '', success: false, source: 'groq' };
}

// Try OpenRouter API as backup
async function tryOpenRouterAPI(message: string): Promise<AIResponse> {
  if (!OPENROUTER_API_KEY) {
    return { text: '', success: false, source: 'openrouter' };
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': siteConfig.url,
        'X-Title': 'Essay Writing Assistant',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free', // Free model
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.choices[0]?.message?.content || '',
        success: true,
        source: 'openrouter'
      };
    }
  } catch (error) {
    console.log('OpenRouter API failed:', error);
  }

  return { text: '', success: false, source: 'openrouter' };
}

// Try Hugging Face API as last resort
async function tryHuggingFaceAPI(message: string): Promise<AIResponse> {
  if (!HF_API_KEY) {
    return { text: '', success: false, source: 'huggingface' };
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: [],
          generated_responses: [],
          text: message
        },
        parameters: {
          max_length: 200,
          temperature: 0.7,
        }
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.generated_text || '',
        success: true,
        source: 'huggingface'
      };
    }
  } catch (error) {
    console.log('Hugging Face API failed:', error);
  }

  return { text: '', success: false, source: 'huggingface' };
}

// Fallback responses for common essay writing questions
const FALLBACK_RESPONSES = {
  grammar: "🔍 **Grammar Excellence Tips:**\n\n✅ **Core Rules:** Subject-verb agreement, proper punctuation, parallel structure\n📝 **Common Fixes:** Avoid run-ons, fix comma splices, use active voice\n🎯 **Pro Tips:** Read aloud, check apostrophes, maintain consistent tense\n💡 **Quick Check:** Does each sentence express a complete thought?\n\n**Remember:** Strong grammar builds credibility and enhances clarity!",
  
  writing: "✍️ **Essay Writing Mastery:**\n\n🎯 **Foundation:** Clear thesis + strong topic sentences + solid evidence\n📝 **Flow:** Logical progression from introduction through conclusion\n💡 **Engagement:** Use varied sentence structure and compelling examples\n📚 **Support:** Integrate credible sources with proper citations\n\n**Pro Tip:** Great writing combines clear thinking with engaging expression!",
  
  structure: "🏗️ **Essay Structure Blueprint:**\n\n📖 **Introduction:** Hook + Background + Thesis (3-5 sentences)\n📝 **Body Paragraphs:** Topic sentence + Evidence + Analysis + Transition\n🎯 **Conclusion:** Restate thesis + Summarize + Call to action\n💡 **Flow:** Each paragraph should connect logically to the next\n\n**Golden Rule:** One main idea per paragraph for maximum clarity!",
  
  plagiarism: "🛡️ **Academic Integrity Guide:**\n\n📚 **Always Cite:** Direct quotes, paraphrases, facts, statistics, ideas\n✍️ **Proper Format:** Use APA/MLA style consistently throughout\n🔍 **Quote vs Paraphrase:** Quote for exact words, paraphrase for ideas\n💡 **Reference Management:** Use tools like Zotero or EndNote\n\n**When in doubt, cite it out!** Our plagiarism checker helps ensure originality.",
  
  ai: "🤖 **Authenticity & AI Detection:**\n\n✨ **Write Authentically:** Personal experiences + unique insights + original analysis\n🎨 **Natural Style:** Vary sentence length, use your vocabulary, show personality\n💭 **Add Value:** Ask questions, make connections, share perspectives\n🔍 **Quality Focus:** AI detectors look for robotic patterns vs human creativity\n\n**Key:** Your authentic voice and original thinking make writing truly yours!",
  
  default: "🎓 **Welcome to Essaytude!**\n\nI'm your expert writing assistant, ready to help you excel! I can provide guidance on:\n\n✍️ **Essay Structure** - thesis, organization, flow\n📝 **Grammar & Style** - clarity, voice, mechanics\n🔍 **Research & Citations** - sources, plagiarism prevention\n🤖 **Authenticity** - original writing, AI detection tips\n💡 **Creative Development** - brainstorming, analysis\n\n**What writing challenge can I help you tackle today?**"
};

// Get fallback response based on keywords
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('grammar') || lowerMessage.includes('mistake')) {
    return FALLBACK_RESPONSES.grammar;
  }
  if (lowerMessage.includes('write') || lowerMessage.includes('essay') || lowerMessage.includes('tip')) {
    return FALLBACK_RESPONSES.writing;
  }
  if (lowerMessage.includes('structure') || lowerMessage.includes('organize')) {
    return FALLBACK_RESPONSES.structure;
  }
  if (lowerMessage.includes('plagiarism') || lowerMessage.includes('copy') || lowerMessage.includes('cite')) {
    return FALLBACK_RESPONSES.plagiarism;
  }
  if (lowerMessage.includes('ai') || lowerMessage.includes('detect') || lowerMessage.includes('original')) {
    return FALLBACK_RESPONSES.ai;
  }
  
  return FALLBACK_RESPONSES.default;
}

// Main function to get AI response
export async function getAIResponse(message: string): Promise<string> {
  console.log('🤖 Getting AI response for:', message);

  // Try APIs in order of preference
  const apis = [tryGroqAPI, tryOpenRouterAPI, tryHuggingFaceAPI];
  
  for (const apiFunction of apis) {
    try {
      const result = await apiFunction(message);
      if (result.success && result.text.trim()) {
        console.log(`✅ Got response from ${result.source}:`, result.text);
        return result.text.trim();
      }
    } catch (error) {
      console.log(`❌ API ${apiFunction.name} failed:`, error);
      continue;
    }
  }

  // If all APIs fail, use intelligent fallback
  console.log('📝 Using fallback response');
  return getFallbackResponse(message);
}

// Function to check if any API keys are configured
export function hasAIAPIKeys(): boolean {
  const validGroqKey = GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here' && GROQ_API_KEY.length >= 10;
  const validHFKey = HF_API_KEY && HF_API_KEY !== 'your_hf_api_key_here' && HF_API_KEY.length >= 10;
  const validOpenRouterKey = OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'your_openrouter_api_key_here' && OPENROUTER_API_KEY.length >= 10;
  
  return !!(validGroqKey || validHFKey || validOpenRouterKey);
}

// Function to get available AI services
export function getAvailableAIServices(): string[] {
  const services = [];
  if (GROQ_API_KEY) services.push('Groq (Llama 3)');
  if (OPENROUTER_API_KEY) services.push('OpenRouter (Llama 3.1)');
  if (HF_API_KEY) services.push('Hugging Face (DialoGPT)');
  if (services.length === 0) services.push('Intelligent Fallback Responses');
  return services;
}
