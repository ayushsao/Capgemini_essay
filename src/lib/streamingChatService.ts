// AI Streaming Chat Service
// Provides real-time streaming responses from various AI providers

interface StreamingMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface StreamingOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// Ollama Local Streaming
const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://localhost:11434/api/chat';

// Groq AI Streaming
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function streamGroqResponse(
  messages: StreamingMessage[],
  options: StreamingOptions = {},
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  if (!apiKey) {
    onError('Groq API key not configured. Please set NEXT_PUBLIC_GROQ_API_KEY.');
    return;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || 'llama-3.1-8b-instant',
        messages,
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Ignore JSON parse errors for incomplete chunks
          }
        }
      }
    }
  } catch (error) {
    console.error('Groq streaming error:', error);
    onError(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

// Together AI Streaming
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

export async function streamTogetherResponse(
  messages: StreamingMessage[],
  options: StreamingOptions = {},
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;
  
  if (!apiKey) {
    onError('Together API key not configured. Please set NEXT_PUBLIC_TOGETHER_API_KEY.');
    return;
  }

  try {
    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages,
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Ignore JSON parse errors for incomplete chunks
          }
        }
      }
    }
  } catch (error) {
    console.error('Together AI streaming error:', error);
    onError(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

// Ollama Local Streaming
export async function streamOllamaResponse(
  messages: StreamingMessage[],
  options: StreamingOptions = {},
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  const ollamaUrl = OLLAMA_API_URL;
  
  try {
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || 'llama3.1:latest',
        messages,
        stream: true,
        options: {
          temperature: options.temperature || 0.7,
          num_predict: options.maxTokens || 2000,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Ollama API error:', errorBody);
      throw new Error(
        `Ollama API request failed with status ${response.status}: ${errorBody || 'No error body'}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          
          if (parsed.message?.content) {
            onChunk(parsed.message.content);
          }
          
          if (parsed.done) {
            onComplete();
            return;
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    }
  } catch (error) {
    console.error('Ollama streaming error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      onError(`Could not connect to Ollama at ${ollamaUrl}. Please ensure Ollama is running and accessible, and that your browser can make requests to it (CORS).`);
    } else {
      onError(error instanceof Error ? error.message : 'An unknown error occurred with Ollama');
    }
  }
}

// Main streaming function with provider fallback
export async function streamAIResponse(
  userMessage: string,
  options: StreamingOptions & { provider?: 'groq' | 'together' | 'ollama' } = {},
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  const messages: StreamingMessage[] = [
    {
      role: 'system',
      content: options.systemPrompt || 'You are a helpful AI assistant focused on providing educational support and essay analysis.'
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  const provider = options.provider || 'groq';

  switch (provider) {
    case 'groq':
      await streamGroqResponse(messages, options, onChunk, onComplete, onError);
      break;
    case 'together':
      await streamTogetherResponse(messages, options, onChunk, onComplete, onError);
      break;
    case 'ollama':
      await streamOllamaResponse(messages, options, onChunk, onComplete, onError);
      break;
    default:
      onError('Unknown AI provider specified');
  }
}

// Essay analysis streaming
export async function streamEssayAnalysis(
  essay: string,
  analysisType: 'grammar' | 'structure' | 'content' | 'style' | 'comprehensive' = 'comprehensive',
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  const prompts = {
    grammar: `Please analyze this essay for grammar, spelling, punctuation, and mechanical errors. Provide specific feedback and corrections:

${essay}`,
    structure: `Please analyze this essay's structure, organization, thesis statement, and paragraph flow. Provide feedback on the logical progression of ideas:

${essay}`,
    content: `Please analyze this essay's content, arguments, evidence, and topic development. Evaluate the strength and relevance of the ideas presented:

${essay}`,
    style: `Please analyze this essay's writing style, tone, clarity, and voice. Provide feedback on word choice and sentence variety:

${essay}`,
    comprehensive: `Please provide a comprehensive analysis of this essay, covering grammar, structure, content, and style. Include specific feedback and suggestions for improvement:

${essay}`
  };

  const systemPrompt = `You are an expert essay tutor and writing instructor. Provide detailed, constructive feedback that helps students improve their writing. Focus on both strengths and areas for improvement. Be encouraging while maintaining academic standards.`;

  await streamAIResponse(
    prompts[analysisType],
    { 
      systemPrompt,
      temperature: 0.7,
      maxTokens: 2000
    },
    onChunk,
    onComplete,
    onError
  );
}
