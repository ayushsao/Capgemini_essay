export interface EssayScore {
  score: number;
  maxScore: number;
}

export interface GrammarError {
  text: string;
  position: number;
  suggestions: string[];
}

export interface EssayAnalysis {
  wordCount: EssayScore;
  spellingAccuracy: EssayScore;
  grammarEvaluation: EssayScore;
  backspaceScore: EssayScore;
  deleteScore: EssayScore;
  totalMarks: number;
  maxTotalMarks: number;
  grammarErrors: GrammarError[];
  suggestions: string[];
  improvementAreas: ImprovementArea[];
}

export interface ImprovementArea {
  category: 'Word Count' | 'Spelling' | 'Grammar' | 'Structure' | 'Content Quality' | 'Typing Efficiency';
  priority: 'high' | 'medium' | 'low';
  description: string;
  tips: string[];
  currentScore: number;
  targetScore: number;
}

export interface TypingMetrics {
  backspaceCount: number;
  deleteCount: number;
  totalKeystrokes: number;
}
