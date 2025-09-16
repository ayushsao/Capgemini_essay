// DEPLOYMENT FIX: Complete mock service with NO external imports
// This replaces any existing OpenAI service implementation

export interface EssayAnalysis {
  wordCount: number;
  grammarScore: number;
  spellingScore: number;
  clarityScore: number;
  coherenceScore: number;
  suggestions: string[];
  totalScore: number;
}

export interface FeedbackResponse {
  overallScore: number;
  feedback: string;
  improvements: string[];
  analysis: EssayAnalysis;
}

// Simple mock service - NO external dependencies
export const analyzeEssay = async (text: string): Promise<EssayAnalysis> => {
  const wordCount = text.split(' ').length;
  const baseScore = Math.min(10, Math.max(1, Math.floor(wordCount / 50) + 5));
  
  return {
    wordCount,
    grammarScore: baseScore + Math.floor(Math.random() * 2),
    spellingScore: baseScore + Math.floor(Math.random() * 2), 
    clarityScore: baseScore + Math.floor(Math.random() * 2),
    coherenceScore: baseScore + Math.floor(Math.random() * 2),
    suggestions: ['Use more varied sentence structures', 'Strengthen your arguments'],
    totalScore: baseScore
  };
};

// Mock feedback generation function
export const generateFeedback = async (essay: string): Promise<FeedbackResponse> => {
  const analysis = await analyzeEssay(essay);
  
  const feedbackTexts = [
    `Your essay demonstrates good understanding of the topic with ${analysis.wordCount} words. Continue developing your arguments with more specific examples.`,
    `Well-structured essay with clear progression of ideas. Focus on strengthening your evidence and supporting details.`,
    `Good foundation established. Consider expanding your analysis and providing more comprehensive conclusions.`,
    `Your writing shows promise. Work on sentence variety and more sophisticated vocabulary choices.`
  ];
  
  return {
    overallScore: analysis.totalScore,
    feedback: feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)],
    improvements: [
      "Focus on stronger thesis statements",
      "Use more varied sentence structures", 
      "Include more supporting evidence",
      "Improve paragraph transitions",
      "Enhance conclusion strength"
    ].slice(0, Math.floor(Math.random() * 3) + 2),
    analysis
  };
};

// Mock real-time analysis for typing
export const analyzeRealTime = (text: string) => {
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedScore = Math.min(10, Math.max(1, Math.floor(wordCount / 50) + 5));
  
  return {
    wordCount,
    estimatedScore,
    suggestions: wordCount < 100 ? ['Continue writing to reach minimum word count'] : []
  };
};
