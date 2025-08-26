import { openai, DEFAULT_OPENAI_CONFIG, ESSAY_ANALYSIS_PROMPTS } from '@/config/openai';

export interface EssayAnalysisResult {
  score: number;
  feedback: string;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  grammarErrors: Array<{
    error: string;
    correction: string;
    position: number;
  }>;
}

export interface EssayAnalysisOptions {
  analysisType: 'grammar' | 'structure' | 'content' | 'style' | 'comprehensive';
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Analyze essay using OpenAI ChatGPT
export async function analyzeEssayWithChatGPT(
  essayText: string,
  options: EssayAnalysisOptions = { analysisType: 'comprehensive' }
): Promise<EssayAnalysisResult> {
  try {
    const prompt = ESSAY_ANALYSIS_PROMPTS[options.analysisType];
    
    const response = await openai.chat.completions.create({
      model: options.model || DEFAULT_OPENAI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: `You are an expert essay writing coach. Provide detailed analysis in JSON format with the following structure:
          {
            "score": number (1-100),
            "feedback": "detailed feedback text",
            "suggestions": ["suggestion1", "suggestion2"],
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "grammarErrors": [{"error": "text", "correction": "text", "position": number}]
          }`
        },
        {
          role: 'user',
          content: `${prompt}\n\nEssay to analyze:\n${essayText}`
        }
      ],
      temperature: options.temperature || DEFAULT_OPENAI_CONFIG.temperature,
      max_tokens: options.maxTokens || DEFAULT_OPENAI_CONFIG.max_tokens,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse JSON response
    try {
      return JSON.parse(content);
    } catch {
      // If JSON parsing fails, create structured response from text
      return {
        score: 75,
        feedback: content,
        suggestions: extractSuggestions(content),
        strengths: extractStrengths(content),
        weaknesses: extractWeaknesses(content),
        grammarErrors: []
      };
    }
  } catch (error) {
    console.error('OpenAI essay analysis error:', error);
    throw new Error(`Failed to analyze essay: ${error}`);
  }
}

// Stream essay feedback in real-time
export async function streamEssayFeedback(
  essayText: string,
  onChunk: (chunk: string) => void,
  onComplete: (result: EssayAnalysisResult) => void,
  options: EssayAnalysisOptions = { analysisType: 'comprehensive' }
): Promise<void> {
  try {
    const prompt = ESSAY_ANALYSIS_PROMPTS[options.analysisType];
    
    const stream = await openai.chat.completions.create({
      model: options.model || DEFAULT_OPENAI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert essay writing coach. Provide detailed, helpful feedback to improve writing quality.'
        },
        {
          role: 'user',
          content: `${prompt}\n\nEssay to analyze:\n${essayText}`
        }
      ],
      temperature: options.temperature || DEFAULT_OPENAI_CONFIG.temperature,
      max_tokens: options.maxTokens || DEFAULT_OPENAI_CONFIG.max_tokens,
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        onChunk(content);
      }
    }

    // Parse final result
    const result: EssayAnalysisResult = {
      score: extractScore(fullResponse),
      feedback: fullResponse,
      suggestions: extractSuggestions(fullResponse),
      strengths: extractStrengths(fullResponse),
      weaknesses: extractWeaknesses(fullResponse),
      grammarErrors: []
    };

    onComplete(result);
  } catch (error) {
    console.error('OpenAI streaming error:', error);
    throw new Error(`Failed to stream essay feedback: ${error}`);
  }
}

// Generate essay improvements using ChatGPT
export async function generateEssayImprovements(
  originalEssay: string,
  analysisResult: EssayAnalysisResult
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_OPENAI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert essay editor. Provide an improved version of the essay based on the analysis feedback.'
        },
        {
          role: 'user',
          content: `Original Essay:\n${originalEssay}\n\nFeedback:\n${analysisResult.feedback}\n\nSuggestions:\n${analysisResult.suggestions.join('\n')}\n\nPlease provide an improved version of this essay.`
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent improvements
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || 'Unable to generate improvements';
  } catch (error) {
    console.error('Essay improvement generation error:', error);
    throw new Error(`Failed to generate improvements: ${error}`);
  }
}

// Helper functions to extract information from text responses
function extractScore(text: string): number {
  const scoreMatch = text.match(/score[:\s]*(\d+)/i);
  return scoreMatch ? parseInt(scoreMatch[1]) : 75;
}

function extractSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.match(/^[\d\-\*\•]\s/)) {
      suggestions.push(line.replace(/^[\d\-\*\•]\s*/, '').trim());
    }
  }
  
  return suggestions.length > 0 ? suggestions : ['Continue developing your writing skills'];
}

function extractStrengths(text: string): string[] {
  const strengths: string[] = [];
  const strengthSection = text.match(/strengths?[:\s]*(.*?)(?=weaknesses?|suggestions?|$)/i);
  
  if (strengthSection) {
    const lines = strengthSection[1].split('\n');
    for (const line of lines) {
      if (line.match(/^[\d\-\*\•]\s/) && line.trim().length > 10) {
        strengths.push(line.replace(/^[\d\-\*\•]\s*/, '').trim());
      }
    }
  }
  
  return strengths.length > 0 ? strengths : ['Good attempt at essay writing'];
}

function extractWeaknesses(text: string): string[] {
  const weaknesses: string[] = [];
  const weaknessSection = text.match(/weaknesses?[:\s]*(.*?)(?=strengths?|suggestions?|$)/i);
  
  if (weaknessSection) {
    const lines = weaknessSection[1].split('\n');
    for (const line of lines) {
      if (line.match(/^[\d\-\*\•]\s/) && line.trim().length > 10) {
        weaknesses.push(line.replace(/^[\d\-\*\•]\s*/, '').trim());
      }
    }
  }
  
  return weaknesses.length > 0 ? weaknesses : ['Room for improvement in structure'];
}

// Check if OpenAI API is available
export function isOpenAIAvailable(): boolean {
  return !!(process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY);
}

// Get OpenAI model pricing info
export function getOpenAIPricing() {
  return {
    'gpt-4o-mini': {
      input: '$0.15 / 1M tokens',
      output: '$0.60 / 1M tokens',
      description: 'Most cost-effective GPT-4 class model'
    },
    'gpt-4o': {
      input: '$5.00 / 1M tokens',
      output: '$15.00 / 1M tokens',
      description: 'High-intelligence flagship model'
    },
    'gpt-3.5-turbo': {
      input: '$0.50 / 1M tokens',
      output: '$1.50 / 1M tokens',
      description: 'Fast, inexpensive model for simple tasks'
    }
  };
}
