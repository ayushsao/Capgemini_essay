// Mock config - no external dependencies
export const mockAPI = {
  analyze: async (text: string) => ({
    score: Math.floor(Math.random() * 10) + 1,
    feedback: "Mock analysis complete"
  })
};

export default mockAPI;
