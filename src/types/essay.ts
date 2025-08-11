export interface EssayScore {
  score: number;
  maxScore: number;
}

export interface GrammarError {
  text: string;
  position: number;
  suggestions: string[];
  severity?: 'error' | 'warning' | 'suggestion';
  source?: 'LanguageTool' | 'Grammarly-Style' | 'Local';
}

export interface PlagiarismResult {
  score: number;
  maxScore: number;
  percentage: number;
  isOriginal: boolean;
  matches?: PlagiarismMatch[];
}

export interface PlagiarismMatch {
  text: string;
  source: string;
  similarity: number;
  position: number;
}

export interface EssayAnalysis {
  wordCount: EssayScore;
  spellingAccuracy: EssayScore;
  grammarEvaluation: EssayScore;
  plagiarismCheck: PlagiarismResult;
  backspaceScore: EssayScore;
  deleteScore: EssayScore;
  totalMarks: number;
  maxTotalMarks: number;
  grammarErrors: GrammarError[];
  suggestions: string[];
  improvementAreas: ImprovementArea[];
  spellingErrors?: any[]; // Optional spelling errors from API
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
