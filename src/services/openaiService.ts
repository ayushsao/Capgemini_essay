
export const analyzeEssay = async (text: string) => ({ wordCount: text.split(' ').length, score: 8 });
export const generateFeedback = async () => ({ overallScore: 8, feedback: "Good work!" });
export const analyzeRealTime = (text: string) => ({ wordCount: text.split(' ').length, estimatedScore: 7 });
