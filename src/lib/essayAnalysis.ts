/*
 * Capgemini Essay Writing Tutor - Essay Analysis Engine
 * © 2025 Ayush Kumar Sao. All rights reserved.
 * 
 * Enhanced with LanguageTool API integration for comprehensive spelling analysis
 */

import { EssayAnalysis, GrammarError, ImprovementArea, PlagiarismResult, PlagiarismMatch } from '@/types/essay';

// Common misspellings and their corrections - expanded list
const commonMisspellings: Record<string, string> = {
  // Basic misspellings
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
  'wierd': 'weird',
  
  // Additional common errors
  'acheive': 'achieve',
  'adress': 'address',
  'arguement': 'argument',
  'buisness': 'business',
  'catagory': 'category',
  'commitee': 'committee',
  'completly': 'completely',
  'conscince': 'conscience',
  'desicion': 'decision',
  'difinition': 'definition',
  'explaination': 'explanation',
  'familar': 'familiar',
  'hieght': 'height',
  'immediatly': 'immediately',
  'judgement': 'judgment',
  'lenght': 'length',
  'mispelling': 'misspelling',
  'necessery': 'necessary',
  'occurance': 'occurrence',
  'posession': 'possession',
  'refering': 'referring',
  'sucessful': 'successful',
  'temperture': 'temperature',
  'unfortunatly': 'unfortunately',
  'vaccum': 'vacuum',
  'wether': 'whether',
  
  // Common word confusions
  'loose': 'lose', // when meant as verb
  'there': 'their', // contextual
  'affect': 'effect', // contextual
  'then': 'than', // contextual
  'alot': 'a lot',
  'everytime': 'every time',
  'inspite': 'in spite',
  'infront': 'in front',
  'alright': 'all right',
  
  // Professional/academic terms
  'analize': 'analyze',
  'caracteristic': 'characteristic',
  'experiance': 'experience',
  'independance': 'independence',
  'responsability': 'responsibility',
  'sucessfull': 'successful',
  'technic': 'technique',
  'therfor': 'therefore',
  'usefull': 'useful',
  'wonderfull': 'wonderful'
};

// Grammar patterns to check - comprehensive grammar checking
const grammarPatterns = [
  // Articles (a/an)
  {
    pattern: /\b(a)\s+(apple|orange|umbrella|hour|honest|honor|ant|elephant|idea|egg|ice|ocean|uncle|example|answer|exercise|office|hour|honor)\b/gi,
    suggestion: 'Use "an" before words starting with vowel sounds'
  },
  {
    pattern: /\b(an)\s+(book|car|house|dog|university|European|one|user|unique|uniform|unit|usual)\b/gi,
    suggestion: 'Use "a" before words starting with consonant sounds'
  },
  
  // Its vs It's
  {
    pattern: /\bits\s+(going|coming|running|working|time|important|difficult|easy|been|a)\b/gi,
    suggestion: 'Use "it\'s" (it is) instead of "its" (possessive)'
  },
  {
    pattern: /\bit\'s\s+(own|color|size|place|way|purpose|function|meaning)\b/gi,
    suggestion: 'Use "its" (possessive) instead of "it\'s" (it is)'
  },
  
  // Your vs You're
  {
    pattern: /\byour\s+(going|coming|running|working|welcome|not|very|so|really|quite|always|never|still)\b/gi,
    suggestion: 'Use "you\'re" (you are) instead of "your" (possessive)'
  },
  {
    pattern: /\byou\'re\s+(name|book|house|car|friend|family|job|work|skills|experience)\b/gi,
    suggestion: 'Use "your" (possessive) instead of "you\'re" (you are)'
  },
  
  // There vs They're vs Their
  {
    pattern: /\bthere\s+(going|coming|running|working|not|very|so|really|quite|always|never|still)\b/gi,
    suggestion: 'Use "they\'re" (they are) instead of "there" (location)'
  },
  {
    pattern: /\bthey\'re\s+(house|car|book|name|family|friends|work|job|skills|way|place)\b/gi,
    suggestion: 'Use "their" (possessive) instead of "they\'re" (they are)'
  },
  {
    pattern: /\btheir\s+(going|coming|running|working|not|very|so|really|quite|always|never|still)\b/gi,
    suggestion: 'Use "they\'re" (they are) instead of "their" (possessive)'
  },
  
  // To vs Too vs Two
  {
    pattern: /\bto\s+(busy|tired|excited|happy|much|many|late|early|fast|slow|good|bad|big|small|difficult|easy)\b/gi,
    suggestion: 'Use "too" (excessively) instead of "to" (direction/infinitive)'
  },
  {
    pattern: /\btoo\s+(go|come|run|work|be|do|have|get|make|take|give|see|know|think|feel|look|find|tell|ask|try|help|start|stop)\b/gi,
    suggestion: 'Use "to" (infinitive) instead of "too" (excessively)'
  },
  
  // Modal verbs with "of"
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
    pattern: /\bmight\s+of\b/gi,
    suggestion: 'Use "might have" instead of "might of"'
  },
  {
    pattern: /\bmust\s+of\b/gi,
    suggestion: 'Use "must have" instead of "must of"'
  },
  
  // Common spelling/grammar errors
  {
    pattern: /\balot\b/gi,
    suggestion: 'Use "a lot" (two words) instead of "alot"'
  },
  {
    pattern: /\bi\s+(?![A-Z])/g,
    suggestion: 'Capitalize "I" when used as a pronoun'
  },
  
  // Subject-verb agreement issues
  {
    pattern: /\b(he|she|it)\s+(are|were)\b/gi,
    suggestion: 'Use "is" or "was" with singular subjects (he/she/it)'
  },
  {
    pattern: /\b(they|we|you)\s+(is|was)\b/gi,
    suggestion: 'Use "are" or "were" with plural subjects (they/we/you)'
  },
  {
    pattern: /\bthere\s+(is|was)\s+\w*\s*(books|cars|people|things|students|problems|questions|answers|ideas|ways|times)\b/gi,
    suggestion: 'Use "there are" or "there were" with plural nouns'
  },
  {
    pattern: /\bthere\s+(are|were)\s+\w*\s*(book|car|person|thing|student|problem|question|answer|idea|way|time)\b/gi,
    suggestion: 'Use "there is" or "there was" with singular nouns'
  },
  
  // Sentence structure issues
  {
    pattern: /\.\s*[a-z]/g,
    suggestion: 'Capitalize the first letter after a period'
  },
  {
    pattern: /\b(because|although|since|while|if|when|before|after)\s+[^.!?]*\./gi,
    suggestion: 'This sentence seems incomplete - dependent clauses need an independent clause'
  },
  
  // Common word confusions
  {
    pattern: /\bthen\s+(i|we|you|they|he|she|it)\s+(am|are|is|was|were|will|would|can|could|should|might)\b/gi,
    suggestion: 'Use "than" for comparisons instead of "then" (time sequence)'
  },
  {
    pattern: /\baffect\b.*\b(the|a|an)\s+\w+/gi,
    suggestion: 'Consider "effect" (noun) instead of "affect" (verb) when used with articles'
  },
  {
    pattern: /\blose\s+(weight|game|match|job|money|time|way|focus|control|patience|temper|hope)\b/gi,
    suggestion: 'Use "lose" (verb) - this usage is correct'
  },
  {
    pattern: /\bloose\s+(weight|game|match|job|money|time|way|focus|control|patience|temper|hope)\b/gi,
    suggestion: 'Use "lose" (verb) instead of "loose" (adjective meaning not tight)'
  },
  
  // Run-on sentences (very basic detection)
  {
    pattern: /\b(and|but|so|or)\s+(and|but|so|or)/gi,
    suggestion: 'Consider breaking this into separate sentences to avoid run-on sentences'
  },
  
  // Missing articles
  {
    pattern: /\b(go to|went to|at|in|on)\s+(school|work|store|hospital|bank|library|university|college|office|home)\b/gi,
    suggestion: 'Consider adding an article (a/an/the) before the noun'
  },
  
  // Apostrophe issues
  {
    pattern: /\b(\w+)s'\s+(\w+)/g,
    suggestion: 'Check apostrophe placement for possessive nouns'
  }
];

// Common plagiarized content patterns and sources
const commonPlagiarizedContent = [
  { text: "education is the most powerful weapon which you can use to change the world", source: "Nelson Mandela Quote" },
  { text: "to be or not to be that is the question", source: "Shakespeare's Hamlet" },
  { text: "four score and seven years ago", source: "Lincoln's Gettysburg Address" },
  { text: "i have a dream that one day", source: "Martin Luther King Jr. Speech" },
  { text: "ask not what your country can do for you", source: "JFK Inaugural Address" },
  { text: "the only thing we have to fear is fear itself", source: "FDR Speech" },
  { text: "we hold these truths to be self evident", source: "Declaration of Independence" },
  { text: "it was the best of times it was the worst of times", source: "Charles Dickens" },
  { text: "in the beginning god created the heaven and the earth", source: "Bible Genesis" },
  { text: "all men are created equal", source: "Declaration of Independence" },
  { text: "the quick brown fox jumps over the lazy dog", source: "Common Typing Text" },
  { text: "lorem ipsum dolor sit amet consectetur", source: "Lorem Ipsum Placeholder" },
  { text: "global warming is one of the most serious issues", source: "Common Essay Template" },
  { text: "technology has changed our lives in many ways", source: "Common Essay Template" },
  { text: "social media has both positive and negative effects", source: "Common Essay Template" },
  { text: "artificial intelligence is the future of technology", source: "Common Essay Template" },
  { text: "climate change is a global crisis that requires", source: "Common Essay Template" },
  { text: "the internet has revolutionized the way we communicate", source: "Common Essay Template" }
];

// Plagiarism detection function
function detectPlagiarism(text: string): PlagiarismResult {
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const matches: PlagiarismMatch[] = [];
  let totalSimilarity = 0;
  let matchedWords = 0;
  const totalWords = cleanText.split(' ').length;

  // Check against known plagiarized content
  commonPlagiarizedContent.forEach(item => {
    const sourceText = item.text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
    const sourceWords = sourceText.split(' ');
    
    // Check for exact phrase matches (3+ consecutive words)
    for (let i = 0; i <= sourceWords.length - 3; i++) {
      const phrase = sourceWords.slice(i, i + 3).join(' ');
      if (cleanText.includes(phrase)) {
        const position = cleanText.indexOf(phrase);
        matches.push({
          text: phrase,
          source: item.source,
          similarity: 100,
          position: position
        });
        matchedWords += 3;
        totalSimilarity += 100;
      }
    }
    
    // Check for partial matches (50%+ word overlap)
    const overlap = sourceWords.filter(word => cleanText.includes(word)).length;
    const similarity = (overlap / sourceWords.length) * 100;
    
    if (similarity >= 50 && overlap >= 4) {
      matches.push({
        text: sourceWords.slice(0, Math.min(8, sourceWords.length)).join(' ') + '...',
        source: item.source,
        similarity: Math.round(similarity),
        position: cleanText.indexOf(sourceWords[0])
      });
      matchedWords += overlap;
      totalSimilarity += similarity;
    }
  });

  // Check for repetitive content patterns (self-plagiarism)
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const sentenceCounts: Record<string, number> = {};
  
  sentences.forEach(sentence => {
    const cleanSentence = sentence.trim();
    if (cleanSentence.length > 15) {
      sentenceCounts[cleanSentence] = (sentenceCounts[cleanSentence] || 0) + 1;
    }
  });

  // Detect repeated sentences
  Object.entries(sentenceCounts).forEach(([sentence, count]) => {
    if (count > 1) {
      matches.push({
        text: sentence.substring(0, 50) + '...',
        source: 'Self-Repetition',
        similarity: count * 25, // 25% penalty per repetition
        position: cleanText.indexOf(sentence)
      });
      totalSimilarity += count * 25;
    }
  });

  // Calculate overall plagiarism percentage
  const uniqueMatches = Array.from(new Set(matches.map(m => m.text)));
  const plagiarismPercentage = Math.min(100, Math.round((matchedWords / Math.max(totalWords, 1)) * 100));
  
  // Determine score based on plagiarism level
  let score = 10;
  if (plagiarismPercentage >= 50) score = 1; // Severe plagiarism
  else if (plagiarismPercentage >= 30) score = 3; // High plagiarism
  else if (plagiarismPercentage >= 15) score = 6; // Moderate plagiarism
  else if (plagiarismPercentage >= 5) score = 8; // Minor plagiarism
  else if (plagiarismPercentage > 0) score = 9; // Very minor plagiarism

  return {
    score: score,
    maxScore: 10,
    percentage: plagiarismPercentage,
    isOriginal: plagiarismPercentage < 5,
    matches: uniqueMatches.length > 0 ? matches.slice(0, 5) : undefined // Limit to 5 matches
  };
}

export function analyzeEssay(text: string): EssayAnalysis {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // If no meaningful content, return all zeros
  if (wordCount === 0 || text.trim().length < 10) {
    return {
      wordCount: { score: 0, maxScore: 10 },
      spellingAccuracy: { score: 0, maxScore: 10 },
      grammarEvaluation: { score: 0, maxScore: 10 },
      plagiarismCheck: { score: 0, maxScore: 10, percentage: 0, isOriginal: true },
      backspaceScore: { score: 0, maxScore: 10 },
      deleteScore: { score: 0, maxScore: 10 },
      totalMarks: 0,
      maxTotalMarks: 60,
      grammarErrors: [],
      suggestions: ['Please write a substantial essay to receive meaningful feedback.'],
      improvementAreas: []
    };
  }
  
  // Word Count Evaluation (target: 200-500 words)
  const wordCountScore = calculateWordCountScore(wordCount);
  
  // Spelling Accuracy Evaluation (using local dictionary as fallback)
  const spellingResults = analyzeSpelling(words);
  
  // Grammar Evaluation
  const grammarResults = analyzeGrammar(text);
  
  // Plagiarism Check
  const plagiarismResults = detectPlagiarism(text);
  
  // Typing Behavior Analysis (placeholder scores)
  const backspaceScore = calculateTypingScore(wordCount, 'backspace');
  const deleteScore = calculateTypingScore(wordCount, 'delete');
  
  // Calculate total score (now includes plagiarism)
  const totalMarks = wordCountScore.score + spellingResults.score + 
                    grammarResults.score + plagiarismResults.score + backspaceScore.score + deleteScore.score;
  const maxTotalMarks = 60;
  
  // Generate improvement suggestions
  const suggestions = generateSuggestions(wordCount, spellingResults, grammarResults);
  const improvementAreas = generateImprovementAreas(
    wordCountScore, spellingResults, grammarResults, 
    backspaceScore, deleteScore, wordCount, grammarResults.errors || []
  );
  
  return {
    wordCount: wordCountScore,
    spellingAccuracy: spellingResults,
    grammarEvaluation: grammarResults,
    plagiarismCheck: plagiarismResults,
    backspaceScore,
    deleteScore,
    totalMarks,
    maxTotalMarks,
    grammarErrors: grammarResults.errors || [],
    suggestions,
    improvementAreas
  };
}

// Enhanced version with API-based spelling analysis
export async function analyzeEssayWithAPI(text: string): Promise<EssayAnalysis> {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // If no meaningful content, return all zeros
  if (wordCount === 0 || text.trim().length < 10) {
    return {
      wordCount: { score: 0, maxScore: 10 },
      spellingAccuracy: { score: 0, maxScore: 10 },
      grammarEvaluation: { score: 0, maxScore: 10 },
      plagiarismCheck: { score: 0, maxScore: 10, percentage: 0, isOriginal: true },
      backspaceScore: { score: 0, maxScore: 10 },
      deleteScore: { score: 0, maxScore: 10 },
      totalMarks: 0,
      maxTotalMarks: 60,
      grammarErrors: [],
      suggestions: ['Please write a substantial essay to receive meaningful feedback.'],
      improvementAreas: [],
      spellingErrors: []
    };
  }
  
  // Word Count Evaluation (target: 200-500 words)
  const wordCountScore = calculateWordCountScore(wordCount);
  
  // Enhanced Spelling Accuracy Evaluation using API
  const spellingResults = await analyzeSpellingWithAPI(text);
  
  // Enhanced Grammar Evaluation with multiple APIs
  const grammarResults = await analyzeGrammarWithAPIs(text);
  
  // Plagiarism Check
  const plagiarismResults = detectPlagiarism(text);
  
  // Typing Behavior Analysis (placeholder scores)
  const backspaceScore = calculateTypingScore(wordCount, 'backspace');
  const deleteScore = calculateTypingScore(wordCount, 'delete');
  
  // Calculate total score (now includes plagiarism)
  const totalMarks = wordCountScore.score + spellingResults.score + 
                    grammarResults.score + plagiarismResults.score + backspaceScore.score + deleteScore.score;
  const maxTotalMarks = 60;
  
  // Generate improvement suggestions
  const suggestions = generateSuggestions(wordCount, spellingResults, grammarResults);
  const improvementAreas = generateImprovementAreas(
    wordCountScore, spellingResults, grammarResults, 
    backspaceScore, deleteScore, wordCount, grammarResults.errors || []
  );
  
  return {
    wordCount: wordCountScore,
    spellingAccuracy: spellingResults,
    grammarEvaluation: grammarResults,
    plagiarismCheck: plagiarismResults,
    backspaceScore,
    deleteScore,
    totalMarks,
    maxTotalMarks,
    grammarErrors: grammarResults.errors || [],
    suggestions,
    improvementAreas,
    spellingErrors: spellingResults.errors || []
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

// Enhanced spelling analysis using LanguageTool API
async function analyzeSpellingWithAPI(text: string): Promise<{ score: number; maxScore: number; errors: any[] }> {
  const maxScore = 10;
  
  // Need sufficient content to properly evaluate spelling
  if (text.trim().length < 10) {
    return { score: 0, maxScore, errors: [] };
  }

  try {
    // Use LanguageTool free API for comprehensive spelling check
    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        language: 'en-US',
        enabledOnly: 'false',
        // Focus on spelling errors
        enabledCategories: 'TYPOS,CONFUSED_WORDS,SPELLING',
        disabledCategories: 'PUNCTUATION,GRAMMAR,STYLE,COLLOQUIALISMS'
      })
    });

    if (!response.ok) {
      console.warn('LanguageTool API request failed, falling back to local dictionary');
      return analyzeSpellingLocal(text.split(/\s+/));
    }

    const data = await response.json();
    const spellingErrors = data.matches.filter((match: any) => 
      match.rule.category.id === 'TYPOS' || 
      match.rule.category.id === 'CONFUSED_WORDS' || 
      match.rule.category.id === 'SPELLING'
    );

    // Calculate score based on error density
    const wordCount = text.trim().split(/\s+/).length;
    const errorRate = spellingErrors.length / Math.max(wordCount, 1);
    
    let score = maxScore;
    
    if (spellingErrors.length === 0) {
      score = maxScore; // Perfect spelling
    } else {
      // More strict scoring based on error density
      if (errorRate >= 0.15) score = 1; // 15%+ errors = very poor
      else if (errorRate >= 0.1) score = 2; // 10-14% errors = poor
      else if (errorRate >= 0.08) score = 3; // 8-9% errors = below average
      else if (errorRate >= 0.06) score = 4; // 6-7% errors = fair
      else if (errorRate >= 0.04) score = 5; // 4-5% errors = okay
      else if (errorRate >= 0.03) score = 6; // 3% errors = good
      else if (errorRate >= 0.02) score = 7; // 2% errors = very good
      else if (errorRate >= 0.01) score = 8; // 1% errors = excellent
      else score = 9; // <1% errors = nearly perfect
    }

    // Adjust score based on content length
    if (wordCount < 15) {
      score = Math.min(score, 4); // Cap score for very short content
    } else if (wordCount < 30) {
      score = Math.min(score, 7); // Cap score for short content
    }

    // Bonus for longer essays with excellent spelling
    if (wordCount >= 100 && spellingErrors.length === 0) {
      score = maxScore;
    }

    return { 
      score: Math.max(0, Math.min(maxScore, Math.round(score))), 
      maxScore, 
      errors: spellingErrors 
    };

  } catch (error) {
    console.warn('Error with LanguageTool API, falling back to local dictionary:', error);
    return analyzeSpellingLocal(text.split(/\s+/));
  }
}

// Fallback local spelling analysis (original function)
function analyzeSpellingLocal(words: string[]): { score: number; maxScore: number; errors: any[] } {
  const maxScore = 10;
  let misspelledCount = 0;
  let totalValidWords = 0;
  const errors: any[] = [];
  
  // Need sufficient content to properly evaluate spelling
  if (words.length < 5) {
    return { score: 0, maxScore, errors: [] };
  }
  
  words.forEach((word, index) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length > 2) {
      totalValidWords++;
      if (commonMisspellings[cleanWord]) {
        misspelledCount++;
        errors.push({
          message: `Possible spelling error: "${word}"`,
          offset: 0,
          length: word.length,
          replacements: [{ value: commonMisspellings[cleanWord] }],
          rule: { category: { id: 'TYPOS' } }
        });
      }
    }
  });
  
  if (totalValidWords === 0) return { score: 0, maxScore, errors: [] };
  
  let score = 0;
  
  if (misspelledCount === 0) {
    score = maxScore;
  } else {
    const errorRate = misspelledCount / totalValidWords;
    
    if (errorRate >= 0.3) score = 1;
    else if (errorRate >= 0.2) score = 3;
    else if (errorRate >= 0.15) score = 4;
    else if (errorRate >= 0.1) score = 5;
    else if (errorRate >= 0.08) score = 6;
    else if (errorRate >= 0.05) score = 7;
    else if (errorRate >= 0.03) score = 8;
    else score = 9;
  }
  
  // Adjust score based on content length
  if (words.length < 15) {
    score = Math.min(score, 3);
  } else if (words.length < 30) {
    score = Math.min(score, 6);
  } else if (words.length < 50) {
    score = Math.min(score, 8);
  }
  
  return { score: Math.max(0, Math.min(maxScore, Math.round(score))), maxScore, errors };
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
  
  // Calculate accuracy rate
  const accuracyRate = Math.max(0, (totalValidWords - misspelledCount) / totalValidWords);
  
  // More strict scoring - penalize mistakes more heavily
  let score = 0;
  
  if (misspelledCount === 0) {
    score = maxScore; // Perfect spelling gets full points
  } else {
    // Deduct points for each misspelling
    const errorRate = misspelledCount / totalValidWords;
    
    if (errorRate >= 0.3) score = 1; // 30%+ errors = very poor
    else if (errorRate >= 0.2) score = 3; // 20-29% errors = poor
    else if (errorRate >= 0.15) score = 4; // 15-19% errors = below average
    else if (errorRate >= 0.1) score = 5; // 10-14% errors = fair
    else if (errorRate >= 0.08) score = 6; // 8-9% errors = good
    else if (errorRate >= 0.05) score = 7; // 5-7% errors = very good
    else if (errorRate >= 0.03) score = 8; // 3-4% errors = excellent
    else score = 9; // 1-2% errors = nearly perfect
  }
  
  // Adjust score based on content length
  if (words.length < 15) {
    score = Math.min(score, 3); // Cap score for very short content
  } else if (words.length < 30) {
    score = Math.min(score, 6); // Cap score for short content
  } else if (words.length < 50) {
    score = Math.min(score, 8); // Cap score for medium content
  }
  
  // Bonus for longer essays with good spelling
  if (words.length >= 100 && accuracyRate >= 0.98) {
    score = Math.min(maxScore, score + 1);
  }
  
  return { score, maxScore };
}

// Enhanced version with configurable grammar analysis
export async function analyzeEssayWithAdvancedGrammar(text: string, useAdvancedGrammar: boolean = true): Promise<EssayAnalysis> {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // If no meaningful content, return all zeros
  if (wordCount === 0 || text.trim().length < 10) {
    return {
      wordCount: { score: 0, maxScore: 10 },
      spellingAccuracy: { score: 0, maxScore: 10 },
      grammarEvaluation: { score: 0, maxScore: 10 },
      plagiarismCheck: { score: 0, maxScore: 10, percentage: 0, isOriginal: true },
      backspaceScore: { score: 0, maxScore: 10 },
      deleteScore: { score: 0, maxScore: 10 },
      totalMarks: 0,
      maxTotalMarks: 60,
      grammarErrors: [],
      suggestions: ['Please write a substantial essay to receive meaningful feedback.'],
      improvementAreas: [],
      spellingErrors: []
    };
  }
  
  // Word Count Evaluation (target: 200-500 words)
  const wordCountScore = calculateWordCountScore(wordCount);
  
  // Enhanced Spelling Accuracy Evaluation using API
  const spellingResults = await analyzeSpellingWithAPI(text);
  
  // Choose grammar analysis method based on setting
  const grammarResults = useAdvancedGrammar 
    ? await analyzeGrammarWithAPIs(text)
    : analyzeGrammarLocal(text);
  
  // Plagiarism Check
  const plagiarismResults = detectPlagiarism(text);
  
  // Typing Behavior Analysis (placeholder scores)
  const backspaceScore = calculateTypingScore(wordCount, 'backspace');
  const deleteScore = calculateTypingScore(wordCount, 'delete');
  
  // Calculate total score (now includes plagiarism)
  const totalMarks = wordCountScore.score + spellingResults.score + 
                    grammarResults.score + plagiarismResults.score + backspaceScore.score + deleteScore.score;
  const maxTotalMarks = 60;
  
  // Generate improvement suggestions
  const suggestions = generateSuggestions(wordCount, spellingResults, grammarResults);
  const improvementAreas = generateImprovementAreas(
    wordCountScore, spellingResults, grammarResults, 
    backspaceScore, deleteScore, wordCount, grammarResults.errors || []
  );
  
  return {
    wordCount: wordCountScore,
    spellingAccuracy: spellingResults,
    grammarEvaluation: grammarResults,
    plagiarismCheck: plagiarismResults,
    backspaceScore,
    deleteScore,
    totalMarks,
    maxTotalMarks,
    grammarErrors: grammarResults.errors || [],
    suggestions,
    improvementAreas,
    spellingErrors: spellingResults.errors || []
  };
}
async function analyzeGrammarWithAPIs(text: string): Promise<{ score: number; maxScore: number; errors?: GrammarError[] }> {
  const maxScore = 10;
  const allErrors: GrammarError[] = [];
  
  // Need sufficient content to properly evaluate grammar
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  if (words.length < 5) {
    return { score: 0, maxScore, errors: allErrors };
  }

  try {
    // Try multiple grammar APIs for comprehensive analysis
    const [languageToolErrors, grammarlyErrors, localErrors] = await Promise.allSettled([
      analyzeWithLanguageTool(text),
      analyzeWithGrammarly(text),
      Promise.resolve(analyzeGrammarLocal(text))
    ]);

    // Combine results from all APIs
    if (languageToolErrors.status === 'fulfilled') {
      allErrors.push(...languageToolErrors.value);
    }
    
    if (grammarlyErrors.status === 'fulfilled') {
      allErrors.push(...grammarlyErrors.value);
    }
    
    if (localErrors.status === 'fulfilled') {
      allErrors.push(...localErrors.value.errors || []);
    }

    // Remove duplicate errors (same position or similar text)
    const uniqueErrors = removeDuplicateErrors(allErrors);

    // Calculate score based on error density
    const wordCount = words.length;
    const errorRate = uniqueErrors.length / Math.max(wordCount / 10, 1);
    
    let score = maxScore;
    
    // More comprehensive scoring with API results - FIXED to properly penalize errors
    if (uniqueErrors.length === 0) {
      score = maxScore; // Perfect grammar
    } else {
      // Strict scoring - even 1 error should reduce score significantly
      const errorCount = uniqueErrors.length;
      
      // Base penalty for having any errors at all
      score = maxScore - 1; // Start with 9/10 for any errors
      
      // Additional penalties based on error count
      if (errorCount >= 5) score = Math.max(1, score - 6); // 5+ errors = very poor (1-3 points)
      else if (errorCount >= 4) score = Math.max(2, score - 5); // 4 errors = poor (2-4 points)
      else if (errorCount >= 3) score = Math.max(3, score - 4); // 3 errors = below average (3-5 points)
      else if (errorCount >= 2) score = Math.max(5, score - 3); // 2 errors = fair (5-6 points)
      else if (errorCount === 1) score = Math.max(7, score - 1); // 1 error = good (7-8 points)
      
      // Additional penalty based on error density for longer texts
      if (errorRate > 2) score = Math.max(1, score - 2);
      else if (errorRate > 1) score = Math.max(2, score - 1);
    }

    // Content length adjustments
    if (wordCount < 15) {
      score = Math.min(score, 3);
    } else if (wordCount < 30) {
      score = Math.min(score, 6);
    } else if (wordCount < 50) {
      score = Math.min(score, 8);
    }

    // Bonus for longer essays with excellent grammar
    if (wordCount >= 150 && uniqueErrors.length === 0) {
      score = maxScore;
    } else if (wordCount >= 100 && uniqueErrors.length <= 1) {
      score = Math.min(maxScore, score + 1);
    }

    return { 
      score: Math.max(0, Math.min(maxScore, Math.round(score))), 
      maxScore, 
      errors: uniqueErrors 
    };

  } catch (error) {
    console.warn('Error with grammar APIs, falling back to local analysis:', error);
    return analyzeGrammarLocal(text);
  }
}

// LanguageTool API for grammar checking
async function analyzeWithLanguageTool(text: string): Promise<GrammarError[]> {
  const response = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text: text,
      language: 'en-US',
      enabledOnly: 'false',
      // Focus on grammar and style errors
      enabledCategories: 'GRAMMAR,STYLE,TYPOGRAPHY,CONFUSED_WORDS',
      disabledCategories: 'TYPOS,SPELLING'
    })
  });

  if (!response.ok) {
    throw new Error('LanguageTool API failed');
  }

  const data = await response.json();
  const grammarErrors = data.matches.filter((match: any) => 
    match.rule.category.id === 'GRAMMAR' || 
    match.rule.category.id === 'STYLE' ||
    match.rule.category.id === 'TYPOGRAPHY' ||
    match.rule.category.id === 'CONFUSED_WORDS'
  );

  return grammarErrors.map((error: any) => ({
    text: text.substring(error.offset, error.offset + error.length),
    position: error.offset,
    suggestions: error.replacements?.map((r: any) => r.value) || [error.message],
    severity: error.rule.category.id === 'GRAMMAR' ? 'error' : 'warning',
    source: 'LanguageTool'
  }));
}

// Grammarly API integration (using their public API endpoint)
async function analyzeWithGrammarly(text: string): Promise<GrammarError[]> {
  try {
    // Note: This is a simplified example. In production, you'd need proper Grammarly API credentials
    // For demo purposes, we'll simulate Grammarly-style checks with enhanced patterns
    
    const grammarlyPatterns = [
      // Enhanced grammar patterns that Grammarly typically catches
      {
        pattern: /\b(I|me)\s+and\s+\w+/gi,
        message: 'Consider putting yourself last in a series (e.g., "John and I" instead of "I and John")',
        category: 'ETIQUETTE'
      },
      {
        pattern: /\bwho\s+(is|are|was|were)\s+\w+ing\b/gi,
        message: 'Consider using "whom" instead of "who" when it\'s the object of a verb or preposition',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(less|fewer)\s+(people|students|books|cars|items|things)/gi,
        message: 'Use "fewer" with countable nouns and "less" with uncountable nouns',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(much|many)\s+(water|time|money|information|advice)/gi,
        message: 'Use "much" with uncountable nouns and "many" with countable nouns',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(between|among)\s+\w+\s+and\s+\w+\s+and\s+\w+/gi,
        message: 'Use "among" when referring to three or more items, "between" for two items',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(lay|lie)\s+(down|on|in)/gi,
        message: 'Use "lay" when placing something down (transitive), "lie" when reclining (intransitive)',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(good|well)\s+(doing|performed|executed|written)/gi,
        message: 'Use "well" as an adverb to modify verbs, "good" as an adjective to modify nouns',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(who|whom)\s+(I|we|you|they|he|she)\s+(think|believe|know|assume)/gi,
        message: 'In clauses with "I think/believe," use "who" for the subject',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(comprise|include)\s+of\b/gi,
        message: 'Use "comprise" without "of" (The team comprises five members) or use "consist of"',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(irregardless)\b/gi,
        message: 'Use "regardless" instead of "irregardless"',
        category: 'GRAMMAR'
      },
      {
        pattern: /\b(very|really|quite|extremely)\s+(unique|perfect|dead|pregnant|impossible)/gi,
        message: 'Avoid intensifying absolute adjectives like "unique," "perfect," or "impossible"',
        category: 'STYLE'
      },
      {
        pattern: /\b(impact)\s+(on)\b/gi,
        message: 'Consider using "effect on" or "influence on" instead of "impact on" for more precise writing',
        category: 'STYLE'
      }
    ];

    const errors: GrammarError[] = [];
    
    grammarlyPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern.pattern);
      for (const match of matches) {
        if (match.index !== undefined) {
          errors.push({
            text: match[0],
            position: match.index,
            suggestions: [pattern.message],
            severity: pattern.category === 'GRAMMAR' ? 'error' : 'suggestion',
            source: 'Grammarly-Style'
          });
        }
      }
    });

    // Add passive voice detection (Grammarly specialty)
    const passivePattern = /\b(is|are|was|were|being|been)\s+\w+ed\b/gi;
    const passiveMatches = text.matchAll(passivePattern);
    let passiveCount = 0;
    
    for (const match of passiveMatches) {
      passiveCount++;
      if (passiveCount > 2 && match.index !== undefined) { // Only flag if there are many passive constructions
        errors.push({
          text: match[0],
          position: match.index,
          suggestions: ['Consider using active voice for more engaging writing'],
          severity: 'suggestion',
          source: 'Grammarly-Style'
        });
      }
    }

    return errors;

  } catch (error) {
    console.warn('Grammarly-style analysis failed:', error);
    return [];
  }
}

// Local grammar analysis (fallback)
function analyzeGrammarLocal(text: string): { score: number; maxScore: number; errors?: GrammarError[] } {
  const maxScore = 10;
  const errors: GrammarError[] = [];
  
  // Need sufficient content to properly evaluate grammar
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  if (words.length < 5) {
    return { score: 0, maxScore, errors };
  }
  
  // Check against all grammar patterns
  grammarPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern.pattern);
    for (const match of matches) {
      if (match.index !== undefined) {
        errors.push({
          text: match[0],
          position: match.index,
          suggestions: [pattern.suggestion],
          source: 'Local'
        });
      }
    }
  });
  
  // Calculate score based on error density - FIXED to match API scoring
  const wordCount = words.length;
  const errorCount = errors.length;
  
  let score = maxScore;
  
  // Use same scoring logic as API version for consistency
  if (errorCount === 0) {
    score = maxScore; // Perfect grammar
  } else {
    // Base penalty for having any errors at all
    score = maxScore - 1; // Start with 9/10 for any errors
    
    // Additional penalties based on error count
    if (errorCount >= 5) score = Math.max(1, score - 6); // 5+ errors = very poor (1-3 points)
    else if (errorCount >= 4) score = Math.max(2, score - 5); // 4 errors = poor (2-4 points)
    else if (errorCount >= 3) score = Math.max(3, score - 4); // 3 errors = below average (3-5 points)
    else if (errorCount >= 2) score = Math.max(5, score - 3); // 2 errors = fair (5-6 points)
    else if (errorCount === 1) score = Math.max(7, score - 1); // 1 error = good (7-8 points)
    
    // Additional penalty for high error density
    const errorRate = errorCount / Math.max(wordCount / 10, 1);
    if (errorRate > 2) score = Math.max(1, score - 2);
    else if (errorRate > 1) score = Math.max(2, score - 1);
  }
  
  // Content length adjustments
  if (words.length < 15) {
    score = Math.min(score, 3);
  } else if (words.length < 30) {
    score = Math.min(score, 5);
  } else if (words.length < 50) {
    score = Math.min(score, 7);
  }
  
  score = Math.max(0, Math.min(maxScore, Math.round(score * 2) / 2));
  
  return { score, maxScore, errors };
}

// Remove duplicate errors from multiple APIs
function removeDuplicateErrors(errors: GrammarError[]): GrammarError[] {
  const uniqueErrors: GrammarError[] = [];
  const seen = new Set<string>();
  
  errors.forEach(error => {
    // Create a unique key based on position and text
    const key = `${error.position}-${error.text.toLowerCase().trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueErrors.push(error);
    }
  });
  
  return uniqueErrors;
}

function analyzeGrammar(text: string): { score: number; maxScore: number; errors?: GrammarError[] } {
  const maxScore = 10;
  const errors: GrammarError[] = [];
  
  // Need sufficient content to properly evaluate grammar
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  if (words.length < 5) {
    return { score: 0, maxScore, errors }; // No score for insufficient content
  }
  
  // Check against all grammar patterns
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
  
  // Additional grammar checks
  
  // Check for missing capitalization at sentence beginnings
  const sentences = text.split(/[.!?]+/);
  for (let i = 0; i < sentences.length - 1; i++) {
    const nextSentence = sentences[i + 1].trim();
    if (nextSentence.length > 0 && /^[a-z]/.test(nextSentence)) {
      errors.push({
        text: nextSentence.substring(0, 10) + "...",
        position: 0,
        suggestions: ["Capitalize the first letter of each sentence"]
      });
    }
  }
  
  // Check for run-on sentences (very long sentences without proper punctuation)
  const longSentences = text.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length > 25);
  longSentences.forEach(sentence => {
    if (sentence.trim().length > 0) {
      errors.push({
        text: sentence.substring(0, 30) + "...",
        position: 0,
        suggestions: ["Consider breaking this long sentence into smaller ones"]
      });
    }
  });
  
  // Check for repeated words
  const wordArray = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < wordArray.length - 1; i++) {
    if (wordArray[i] === wordArray[i + 1] && wordArray[i].length > 2) {
      errors.push({
        text: wordArray[i] + " " + wordArray[i + 1],
        position: 0,
        suggestions: ["Remove repeated word: " + wordArray[i]]
      });
    }
  }
  
  // Check for basic sentence structure issues
  const sentenceCount = Math.max(1, sentences.length);
  
  // Calculate error density - more sensitive to errors
  const wordCount = words.length;
  const errorRate = errors.length / Math.max(wordCount / 10, 1); // Errors per 10 words
  
  // Base score calculation - start from 10 and deduct points
  let score = maxScore;
  
  // Deduct points for each error found
  const errorPenalty = Math.min(8, errors.length * 1.5); // 1.5 points per error, max 8 points deduction
  score -= errorPenalty;
  
  // Additional penalties based on error density
  if (errorRate > 2) score -= 2; // Very high error rate
  else if (errorRate > 1.5) score -= 1.5; // High error rate
  else if (errorRate > 1) score -= 1; // Medium error rate
  else if (errorRate > 0.5) score -= 0.5; // Low error rate
  
  // Content length adjustments
  if (words.length < 15) {
    score = Math.min(score, 3); // Very low cap for minimal content
  } else if (words.length < 30) {
    score = Math.min(score, 5); // Low cap for short content
  } else if (words.length < 50) {
    score = Math.min(score, 7); // Medium cap for developing content
  }
  
  // Bonus for longer, well-written essays
  if (words.length >= 100 && errors.length === 0) {
    score = Math.min(maxScore, score + 1);
  } else if (words.length >= 200 && errors.length <= 1) {
    score = Math.min(maxScore, score + 0.5);
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(maxScore, Math.round(score * 2) / 2)); // Round to nearest 0.5
  
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
    const specificTips: string[] = [
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
