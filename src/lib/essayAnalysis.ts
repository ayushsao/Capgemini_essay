import { EssayAnalysis, GrammarError, ImprovementArea } from '@/types/essay';

// Common misspellings and their corrections - expanded list
const commonMisspellings: Record<string, string> = {
  'teh': 'the',
  'recieve': 'receive',
  'occured': 'occurred',
  'seperate': 'separate',
  'definately': 'definitely',
  'managment': 'management',
  'enviroment': 'environment',
  'intresting': 'interesting',
  'necesary': 'necessary',
  'publically': 'publicly',
  'accomodate': 'accommodate',
  'begining': 'beginning',
  'beleive': 'believe',
  'calender': 'calendar',
  'cemetary': 'cemetery',
  'changable': 'changeable',
  'collegue': 'colleague',
  'concious': 'conscious',
  'embarass': 'embarrass',
  'existance': 'existence',
  'fourty': 'forty',
  'goverment': 'government',
  'harrass': 'harass',
  'independant': 'independent',
  'knowlege': 'knowledge',
  'maintainance': 'maintenance',
  'mispell': 'misspell',
  'noticable': 'noticeable',
  'occassion': 'occasion',
  'perseverence': 'perseverance',
  'priviledge': 'privilege',
  'recomend': 'recommend',
  'supercede': 'supersede',
  'tommorow': 'tomorrow',
  'untill': 'until',
  'wierd': 'weird'
};

// Grammar patterns to check - expanded and more comprehensive
const grammarPatterns = [
  {
    pattern: /\b(a)\s+(apple|orange|umbrella|hour|honest|honor)\b/gi,
    suggestion: 'Use "an" before words starting with vowel sounds'
  },
  {
    pattern: /\b(an)\s+(book|car|house|dog|university|European)\b/gi,
    suggestion: 'Use "a" before words starting with consonant sounds'
  },
  {
    pattern: /\bits\s+(going|coming|running|working)\b/gi,
    suggestion: 'Use "it\'s" (it is) instead of "its" (possessive)'
  },
  {
    pattern: /\byour\s+(going|coming|running|working|welcome)\b/gi,
    suggestion: 'Use "you\'re" (you are) instead of "your" (possessive)'
  },
  {
    pattern: /\bthere\s+(going|coming|running|working)\b/gi,
    suggestion: 'Use "they\'re" (they are) instead of "there" (location)'
  },
  {
    pattern: /\bto\s+(busy|tired|excited|happy)\b/gi,
    suggestion: 'Use "too" (excessively) instead of "to" (direction/infinitive)'
  },
  {
    pattern: /\baffect\b(?=.*\b(the|a|an)\s+\w+)/gi,
    suggestion: 'Consider "effect" (noun) instead of "affect" (verb) in this context'
  },
  {
    pattern: /\bshould\s+of\b/gi,
    suggestion: 'Use "should have" instead of "should of"'
  },
  {
    pattern: /\bcould\s+of\b/gi,
    suggestion: 'Use "could have" instead of "could of"'
  },
  {
    pattern: /\bwould\s+of\b/gi,
    suggestion: 'Use "would have" instead of "would of"'
  },
  {
    pattern: /\balot\b/gi,
    suggestion: 'Use "a lot" (two words) instead of "alot"'
  },
  {
    pattern: /\bi\s+(?![A-Z])/g,
    suggestion: 'Capitalize "I" when used as a pronoun'
  }
];

export function analyzeEssay(text: string): EssayAnalysis {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // If no meaningful content, return all zeros
  if (wordCount === 0 || text.trim().length < 10) {
    return {
      wordCount: { score: 0, maxScore: 10 },
      spellingAccuracy: { score: 0, maxScore: 10 },
      grammarEvaluation: { score: 0, maxScore: 10 },
      backspaceScore: { score: 0, maxScore: 10 },
      deleteScore: { score: 0, maxScore: 10 },
      totalMarks: 0,
      maxTotalMarks: 50,
      grammarErrors: [],
      suggestions: ['Please write a substantial essay to receive meaningful feedback.'],
      improvementAreas: []
    };
  }
  
  // Word Count Evaluation (target: 200-500 words)
  const wordCountScore = calculateWordCountScore(wordCount);
  
  // Spelling Accuracy Evaluation
  const spellingResults = analyzeSpelling(words);
  
  // Grammar Evaluation
  const grammarResults = analyzeGrammar(text);
  
  // Calculate typing efficiency based on essay quality and length
  const backspaceScore = calculateTypingScore(wordCount, 'backspace');
  const deleteScore = calculateTypingScore(wordCount, 'delete');
  
  const totalMarks = wordCountScore.score + spellingResults.score + 
                    grammarResults.score + backspaceScore.score + deleteScore.score;
  
  // Generate improvement areas
  const improvementAreas = generateImprovementAreas(
    wordCountScore, 
    spellingResults, 
    grammarResults, 
    backspaceScore, 
    deleteScore,
    wordCount,
    grammarResults.errors || []
  );
  
  return {
    wordCount: wordCountScore,
    spellingAccuracy: spellingResults,
    grammarEvaluation: grammarResults,
    backspaceScore,
    deleteScore,
    totalMarks,
    maxTotalMarks: 50,
    grammarErrors: grammarResults.errors || [],
    suggestions: generateSuggestions(wordCount, spellingResults, grammarResults),
    improvementAreas
  };
}

function calculateWordCountScore(wordCount: number): { score: number; maxScore: number } {
  const maxScore = 10;
  let score = 0;
  
  if (wordCount === 0) {
    score = 0;
  } else if (wordCount < 15) {
    // Very short essays - minimal score
    score = Math.round((wordCount / 15) * 0.5); // 0-0.5 points for under 15 words
  } else if (wordCount < 30) {
    // Still very short
    score = Math.round(0.5 + ((wordCount - 15) / 15) * 1.5); // 0.5-2 points for 15-30 words
  } else if (wordCount < 75) {
    // Short but getting better
    score = 2 + Math.round(((wordCount - 30) / 45) * 2); // 2-4 points for 30-75 words
  } else if (wordCount < 150) {
    // Decent length
    score = 4 + Math.round(((wordCount - 75) / 75) * 3); // 4-7 points for 75-150 words
  } else if (wordCount < 300) {
    // Good length
    score = 7 + Math.round(((wordCount - 150) / 150) * 2); // 7-9 points for 150-300 words
  } else if (wordCount <= 500) {
    // Optimal length
    score = 9 + Math.round(((wordCount - 300) / 200) * 1); // 9-10 points for 300-500 words
  } else if (wordCount <= 700) {
    // Getting too long
    score = Math.max(7, 10 - Math.round((wordCount - 500) / 100)); // 7-9 points, penalty starts
  } else {
    // Too long
    score = Math.max(3, 7 - Math.round((wordCount - 700) / 100)); // 3-7 points, significant penalty
  }
  
  return { score: Math.min(Math.max(score, 0), maxScore), maxScore };
}

function calculateTypingScore(wordCount: number, type: 'backspace' | 'delete'): { score: number; maxScore: number } {
  const maxScore = 10;
  
  // Realistic typing efficiency based on essay development and quality
  if (wordCount < 10) {
    return { score: 1, maxScore }; // Very low score for minimal effort
  } else if (wordCount < 25) {
    return { score: 2, maxScore }; // Still very low for short content
  } else if (wordCount < 50) {
    return { score: 3, maxScore }; // Low score for developing content
  } else if (wordCount < 100) {
    return { score: 5, maxScore }; // Medium score for decent content
  } else if (wordCount < 200) {
    return { score: 7, maxScore }; // Good score for well-developed content
  } else if (wordCount < 400) {
    return { score: 8, maxScore }; // High score for substantial content
  } else {
    return { score: 9, maxScore }; // Very high score for comprehensive content
  }
}

function analyzeSpelling(words: string[]): { score: number; maxScore: number } {
  const maxScore = 10;
  let misspelledCount = 0;
  let totalValidWords = 0;
  
  // Need sufficient content to properly evaluate spelling
  if (words.length < 5) {
    return { score: 0, maxScore }; // No score for insufficient content
  }
  
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length > 2) { // Only check words with 3+ letters
      totalValidWords++;
      if (commonMisspellings[cleanWord]) {
        misspelledCount++;
      }
    }
  });
  
  if (totalValidWords === 0) return { score: 0, maxScore };
  
  const accuracyRate = Math.max(0, (totalValidWords - misspelledCount) / totalValidWords);
  
  // Give base points for effort, then scale with accuracy
  let score = Math.round(accuracyRate * maxScore);
  
  // Adjust score based on content length
  if (words.length < 15) {
    score = Math.min(score, 3); // Cap score for very short content
  } else if (words.length < 30) {
    score = Math.min(score, 6); // Cap score for short content
  } else if (words.length < 50) {
    score = Math.min(score, 8); // Cap score for medium content
  }
  
  // Bonus for longer essays with good spelling
  if (words.length >= 100 && accuracyRate > 0.95) {
    score = Math.min(maxScore, score + 1);
  }
  
  return { score, maxScore };
}

function analyzeGrammar(text: string): { score: number; maxScore: number; errors?: GrammarError[] } {
  const maxScore = 10;
  const errors: GrammarError[] = [];
  
  // Need sufficient content to properly evaluate grammar
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  if (words.length < 5) {
    return { score: 0, maxScore, errors }; // No score for insufficient content
  }
  
  grammarPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern.pattern);
    for (const match of matches) {
      if (match.index !== undefined) {
        errors.push({
          text: match[0],
          position: match.index,
          suggestions: [pattern.suggestion]
        });
      }
    }
  });
  
  // Check for basic sentence structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const sentenceCount = Math.max(1, sentences.length);
  
  // Calculate error density
  const errorRate = errors.length / Math.max(sentenceCount, 1);
  
  // Base score calculation
  let score = maxScore;
  
  // Content length adjustments
  if (words.length < 15) {
    score = Math.min(score, 2); // Very low cap for minimal content
  } else if (words.length < 30) {
    score = Math.min(score, 4); // Low cap for short content
  } else if (words.length < 50) {
    score = Math.min(score, 6); // Medium cap for developing content
  } else if (words.length < 100) {
    score = Math.min(score, 8); // Good cap for substantial content
  }
  
  // Error-based penalties
  if (errorRate > 0.8) score = Math.min(score, 1);
  else if (errorRate > 0.6) score = Math.min(score, 2);
  else if (errorRate > 0.4) score = Math.min(score, 3);
  else if (errorRate > 0.3) score = Math.min(score, 4);
  else if (errorRate > 0.2) score = Math.min(score, 6);
  else if (errorRate > 0.1) score = Math.min(score, 7);
  else if (errorRate > 0.05) score = Math.min(score, 8);
  
  // Bonus for longer, error-free essays
  if (words.length >= 200 && errors.length === 0) {
    score = Math.min(maxScore, score + 1);
  }
  
  return { score, maxScore, errors };
}

function generateSuggestions(
  wordCount: number,
  spellingResults: { score: number; maxScore: number },
  grammarResults: { score: number; maxScore: number; errors?: GrammarError[] }
): string[] {
  const suggestions: string[] = [];
  
  // Word count suggestions
  if (wordCount < 20) {
    suggestions.push('Your essay is too short. Aim for at least 150-200 words to develop your ideas properly.');
  } else if (wordCount < 50) {
    suggestions.push('Try to expand your essay with more supporting details, examples, and explanations.');
  } else if (wordCount < 100) {
    suggestions.push('Good start! Add more paragraphs to develop your arguments and provide evidence.');
  } else if (wordCount < 200) {
    suggestions.push('Your essay is developing well. Consider adding a conclusion or more supporting details.');
  } else if (wordCount > 600) {
    suggestions.push('Your essay is quite long. Focus on the most important points and remove unnecessary details.');
  }
  
  // Spelling suggestions
  if (spellingResults.score === 0 && wordCount < 10) {
    suggestions.push('Write more content to receive spelling feedback.');
  } else if (spellingResults.score < 4) {
    suggestions.push('Focus on spelling accuracy. Use spell-check tools and proofread carefully.');
  } else if (spellingResults.score < 7) {
    suggestions.push('Good spelling overall, but double-check commonly misspelled words.');
  }
  
  // Grammar suggestions
  if (grammarResults.score === 0 && wordCount < 10) {
    suggestions.push('Write more content to receive grammar feedback.');
  } else if (grammarResults.score < 3) {
    suggestions.push('Review basic grammar rules, especially sentence structure and punctuation.');
  } else if (grammarResults.score < 6) {
    suggestions.push('Pay attention to grammar details like article usage (a/an/the) and pronoun consistency.');
  } else if (grammarResults.score < 8) {
    suggestions.push('Good grammar foundation. Review any highlighted errors for improvement.');
  }
  
  // Error-specific suggestions
  if (grammarResults.errors && grammarResults.errors.length > 0) {
    suggestions.push(`Address the ${grammarResults.errors.length} grammar issue(s) highlighted in your essay.`);
  }
  
  // Encouragement and next steps
  if (wordCount >= 200 && spellingResults.score >= 8 && grammarResults.score >= 8) {
    suggestions.push('Excellent work! Your essay demonstrates strong writing skills. Consider adding more sophisticated vocabulary or complex sentence structures.');
  } else if (wordCount >= 100 && spellingResults.score >= 6 && grammarResults.score >= 6) {
    suggestions.push('Good progress! Focus on expanding your ideas while maintaining accuracy.');
  }
  
  // Always provide at least one suggestion
  if (suggestions.length === 0) {
    suggestions.push('Keep writing to receive more detailed feedback and suggestions for improvement.');
  }
  
  return suggestions;
}

function generateImprovementAreas(
  wordCountScore: { score: number; maxScore: number },
  spellingResults: { score: number; maxScore: number },
  grammarResults: { score: number; maxScore: number },
  backspaceScore: { score: number; maxScore: number },
  deleteScore: { score: number; maxScore: number },
  wordCount: number,
  grammarErrors: GrammarError[]
): ImprovementArea[] {
  const areas: ImprovementArea[] = [];

  // Word Count Improvement
  if (wordCountScore.score < 7) {
    const priority = wordCountScore.score < 3 ? 'high' : wordCountScore.score < 5 ? 'medium' : 'low';
    let description = '';
    let tips: string[] = [];

    if (wordCount < 50) {
      description = 'Your essay is too short. Aim for at least 150-200 words to properly develop your ideas.';
      tips = [
        'Add more supporting examples and evidence',
        'Expand on your main points with detailed explanations',
        'Include introduction and conclusion paragraphs',
        'Use transitional sentences to connect ideas'
      ];
    } else if (wordCount < 150) {
      description = 'Your essay needs more development. Add more content to reach the optimal length.';
      tips = [
        'Provide more detailed examples',
        'Add a conclusion that summarizes your main points',
        'Include counterarguments or different perspectives',
        'Use more descriptive language and explanations'
      ];
    } else if (wordCount > 600) {
      description = 'Your essay is too long. Focus on being more concise and direct.';
      tips = [
        'Remove unnecessary repetition',
        'Combine related sentences',
        'Focus on the most important points',
        'Use stronger, more precise vocabulary'
      ];
    }

    areas.push({
      category: 'Word Count',
      priority,
      description,
      tips,
      currentScore: wordCountScore.score,
      targetScore: Math.min(10, wordCountScore.score + 3)
    });
  }

  // Spelling Improvement
  if (spellingResults.score < 8) {
    const priority = spellingResults.score < 4 ? 'high' : spellingResults.score < 6 ? 'medium' : 'low';
    
    areas.push({
      category: 'Spelling',
      priority,
      description: 'Your spelling accuracy needs improvement. Focus on commonly misspelled words.',
      tips: [
        'Use spell-check tools while writing',
        'Keep a personal dictionary of words you often misspell',
        'Read more to familiarize yourself with correct spellings',
        'Practice writing commonly misspelled words',
        'Proofread your work carefully before submitting'
      ],
      currentScore: spellingResults.score,
      targetScore: Math.min(10, spellingResults.score + 2)
    });
  }

  // Grammar Improvement
  if (grammarResults.score < 7) {
    const priority = grammarResults.score < 3 ? 'high' : grammarResults.score < 5 ? 'medium' : 'low';
    let specificTips: string[] = [
      'Review basic sentence structure rules',
      'Practice identifying subjects and verbs in sentences',
      'Learn the difference between active and passive voice',
      'Study common grammar patterns and rules'
    ];

    // Add specific tips based on grammar errors found
    if (grammarErrors.length > 0) {
      const errorTypes = grammarErrors.map(error => error.suggestions[0]);
      if (errorTypes.some(tip => tip.includes('article'))) {
        specificTips.unshift('Focus on correct article usage (a, an, the)');
      }
      if (errorTypes.some(tip => tip.includes('pronoun') || tip.includes('possessive'))) {
        specificTips.unshift('Practice distinguishing between contractions and possessives');
      }
    }

    areas.push({
      category: 'Grammar',
      priority,
      description: `Grammar issues detected in your essay. ${grammarErrors.length} specific error(s) need attention.`,
      tips: specificTips,
      currentScore: grammarResults.score,
      targetScore: Math.min(10, grammarResults.score + 3)
    });
  }

  // Structure and Content Quality
  if (wordCount >= 50) {
    const sentences = wordCount / 15; // Rough estimate of sentences
    const avgWordsPerSentence = wordCount / sentences;
    
    if (avgWordsPerSentence < 8 || avgWordsPerSentence > 25) {
      areas.push({
        category: 'Structure',
        priority: 'medium',
        description: 'Your sentence structure could be improved for better readability.',
        tips: [
          'Vary your sentence length for better flow',
          'Use a mix of simple, compound, and complex sentences',
          'Avoid run-on sentences that are difficult to follow',
          'Start sentences with different words to create variety',
          'Use transitional words to connect ideas'
        ],
        currentScore: 6, // Estimated based on structure
        targetScore: 8
      });
    }
  }

  // Typing Efficiency
  if (backspaceScore.score < 6 || deleteScore.score < 6) {
    areas.push({
      category: 'Typing Efficiency',
      priority: 'low',
      description: 'Your typing confidence could be improved through more practice.',
      tips: [
        'Plan your essay before you start typing',
        'Take time to think through your sentences',
        'Practice typing to improve fluency',
        'Use draft outlines to organize your thoughts',
        'Don\'t worry about perfection in the first draft'
      ],
      currentScore: Math.min(backspaceScore.score, deleteScore.score),
      targetScore: 8
    });
  }

  // Overall Content Quality (if total score is low despite decent length)
  const totalScore = wordCountScore.score + spellingResults.score + grammarResults.score;
  if (wordCount >= 100 && totalScore < 15) {
    areas.push({
      category: 'Content Quality',
      priority: 'high',
      description: 'Focus on improving the overall quality and clarity of your writing.',
      tips: [
        'Develop a clear thesis statement',
        'Support your arguments with specific examples',
        'Organize your ideas in logical paragraphs',
        'Use varied vocabulary to express your ideas',
        'Ensure each paragraph has a clear main idea',
        'Connect your ideas with appropriate transitions'
      ],
      currentScore: Math.round(totalScore / 3),
      targetScore: 8
    });
  }

  // Sort by priority (high -> medium -> low)
  areas.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return areas;
}
