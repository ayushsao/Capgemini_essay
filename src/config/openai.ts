import OpenAI from 'openai';

// OpenAI Configuration
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For client-side usage
});

// ChatGPT Models
export const CHATGPT_MODELS = {
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo-preview',
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini'
} as const;

// Default configuration
export const DEFAULT_OPENAI_CONFIG = {
  model: CHATGPT_MODELS.GPT_4O_MINI,
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
};

// Essay analysis specific prompts
export const ESSAY_ANALYSIS_PROMPTS = {
  grammar: `Analyze the following essay for grammar errors and provide detailed corrections:`,
  structure: `Analyze the structure and organization of this essay and provide improvement suggestions:`,
  content: `Evaluate the content quality, arguments, and evidence in this essay:`,
  style: `Analyze the writing style, tone, and clarity of this essay:`,
  comprehensive: `Provide a comprehensive analysis of this essay covering grammar, structure, content, and style:`
};
