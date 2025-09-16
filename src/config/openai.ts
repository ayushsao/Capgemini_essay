// Mock OpenAI configuration for development
export const DEFAULT_OPENAI_CONFIG = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 1000
};

export const ESSAY_ANALYSIS_PROMPTS = {
  grammar: "Analyze the grammar and provide suggestions",
  spelling: "Check spelling and provide corrections", 
  clarity: "Evaluate clarity and coherence",
  overall: "Provide overall essay feedback"
};

// Mock OpenAI client
export const openai = {
  chat: {
    completions: {
      create: async () => ({
        choices: [{ message: { content: "Mock AI response" } }]
      })
    }
  }
};