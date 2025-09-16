// Essay analysis service - mock implementation
export const analyzeEssay = async (text: string) => {
  return {
    wordCount: text.split(' ').length,
    score: 8,
    feedback: 'Good essay structure and content.'
  };
};