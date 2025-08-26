// Advanced AI Prompt Engineering System
// Optimizes prompts for better, more structured responses

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: 'analysis' | 'feedback' | 'correction' | 'enhancement' | 'evaluation';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  responseFormat: 'structured' | 'narrative' | 'bullet' | 'detailed';
}

export class AIPromptEngineer {
  private static templates: PromptTemplate[] = [
    {
      id: 'comprehensive-essay-analysis',
      name: 'Comprehensive Essay Analysis',
      description: 'Complete analysis with structured feedback',
      template: `
You are an expert academic writing tutor. Please analyze the following essay comprehensively and provide structured feedback.

ESSAY TO ANALYZE:
"""
{essayText}
"""

ANALYSIS REQUIREMENTS:
1. Overall Assessment (score out of 100)
2. Strengths identification
3. Areas for improvement
4. Specific issues with locations
5. Actionable recommendations

RESPONSE FORMAT:
Please structure your response as follows:

## OVERALL ASSESSMENT
- Score: [0-100]
- Word Count: [count]
- Grade Level: [level]

## STRENGTHS
- [List 3-5 specific strengths]

## AREAS FOR IMPROVEMENT
- [List 3-5 specific areas]

## DETAILED ANALYSIS

### Grammar & Mechanics
- [Specific issues with line numbers/quotes]
- [Suggestions for improvement]

### Style & Voice
- [Analysis of writing style]
- [Recommendations for enhancement]

### Structure & Organization
- [Assessment of essay structure]
- [Suggestions for better organization]

### Content & Arguments
- [Evaluation of ideas and arguments]
- [Ways to strengthen content]

### Citations & Sources
- [Review of citation format and quality]
- [Suggestions for better source integration]

## ACTION PLAN
Priority 1 (High): [Most critical improvements]
Priority 2 (Medium): [Important enhancements]
Priority 3 (Low): [Nice-to-have improvements]

## EXAMPLE IMPROVEMENTS
For each major issue, provide:
- Original text: "[quote from essay]"
- Improved version: "[your suggestion]"
- Explanation: "[why this is better]"

Be specific, constructive, and encouraging in your feedback.
      `,
      variables: ['essayText'],
      category: 'analysis',
      difficulty: 'advanced',
      responseFormat: 'structured'
    },
    {
      id: 'grammar-focused-review',
      name: 'Grammar-Focused Review',
      description: 'Detailed grammar and mechanics analysis',
      template: `
As a grammar expert, please review this text for grammatical errors, punctuation issues, and mechanical problems.

TEXT TO REVIEW:
"""
{essayText}
"""

For each issue found, please provide:
1. Error type (e.g., subject-verb agreement, comma splice, etc.)
2. Location (quote the problematic text)
3. Correction (show the corrected version)
4. Explanation (brief rule explanation)
5. Severity (Critical/High/Medium/Low)

Format your response as:

## GRAMMAR ANALYSIS REPORT

### CRITICAL ERRORS
[Errors that significantly impact meaning or professionalism]

### HIGH PRIORITY ERRORS
[Important errors that should be fixed]

### MEDIUM PRIORITY ERRORS
[Errors that improve clarity when fixed]

### LOW PRIORITY ERRORS
[Minor issues or style preferences]

### POSITIVE OBSERVATIONS
[Things the writer is doing well grammatically]

### RECOMMENDATIONS
[General advice for avoiding similar errors]
      `,
      variables: ['essayText'],
      category: 'correction',
      difficulty: 'intermediate',
      responseFormat: 'structured'
    },
    {
      id: 'content-enhancement',
      name: 'Content Enhancement',
      description: 'Focus on ideas, arguments, and content quality',
      template: `
As a content specialist, please evaluate the ideas, arguments, and overall content quality of this essay.

ESSAY CONTENT:
"""
{essayText}
"""

Please analyze:

## CONTENT EVALUATION

### THESIS AND MAIN ARGUMENT
- Clarity of thesis statement
- Strength of main argument
- Specificity and focus

### SUPPORTING EVIDENCE
- Quality of evidence provided
- Relevance to main points
- Balance and variety of sources

### LOGICAL FLOW
- Organization of ideas
- Transitions between points
- Coherence and consistency

### DEPTH OF ANALYSIS
- Level of critical thinking
- Originality of insights
- Complexity of analysis

### AUDIENCE AWARENESS
- Appropriateness for intended audience
- Tone and voice consistency
- Engagement level

## ENHANCEMENT SUGGESTIONS

### IMMEDIATE IMPROVEMENTS
[3-5 specific, actionable suggestions]

### LONG-TERM DEVELOPMENT
[Skills to develop for future writing]

### ADDITIONAL RESEARCH
[Suggested areas for further investigation]

Be specific about what to add, remove, or modify to strengthen the content.
      `,
      variables: ['essayText'],
      category: 'enhancement',
      difficulty: 'advanced',
      responseFormat: 'detailed'
    },
    {
      id: 'quick-feedback',
      name: 'Quick Feedback',
      description: 'Fast, essential feedback for rapid improvement',
      template: `
Provide quick, actionable feedback on this essay. Focus on the most important improvements.

ESSAY:
"""
{essayText}
"""

## QUICK ASSESSMENT
Score: [0-100] | Grade: [A-F] | Level: [Beginner/Intermediate/Advanced]

## TOP 3 STRENGTHS
1. [Specific strength]
2. [Specific strength]  
3. [Specific strength]

## TOP 3 IMPROVEMENTS NEEDED
1. [Most critical issue] - [Quick fix]
2. [Second priority] - [Quick fix]
3. [Third priority] - [Quick fix]

## 60-SECOND FIXES
- [List 3-5 changes that can be made in under a minute each]

## OVERALL COMMENT
[2-3 sentences of encouraging, specific feedback]
      `,
      variables: ['essayText'],
      category: 'feedback',
      difficulty: 'basic',
      responseFormat: 'bullet'
    }
  ];

  static getTemplate(templateId: string): PromptTemplate | null {
    return this.templates.find(template => template.id === templateId) || null;
  }

  static getAllTemplates(): PromptTemplate[] {
    return [...this.templates];
  }

  static getTemplatesByCategory(category: string): PromptTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  static buildPrompt(templateId: string, variables: Record<string, string>): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let prompt = template.template;
    
    // Replace variables in the template
    template.variables.forEach(variable => {
      const value = variables[variable] || '';
      prompt = prompt.replace(new RegExp(`{${variable}}`, 'g'), value);
    });

    return prompt;
  }

  static optimizePrompt(basePrompt: string, options: {
    responseLength?: 'concise' | 'detailed' | 'comprehensive';
    tone?: 'encouraging' | 'critical' | 'neutral' | 'academic';
    focus?: string[];
    expertLevel?: 'student' | 'teacher' | 'professor' | 'professional';
  } = {}): string {
    let optimizedPrompt = basePrompt;

    // Add response length instructions
    if (options.responseLength) {
      const lengthInstructions = {
        concise: 'Keep your response concise and focused on the most important points.',
        detailed: 'Provide detailed explanations and examples for each point.',
        comprehensive: 'Give a thorough, comprehensive analysis covering all aspects.'
      };
      optimizedPrompt += `\n\nRESPONSE LENGTH: ${lengthInstructions[options.responseLength]}`;
    }

    // Add tone instructions
    if (options.tone) {
      const toneInstructions = {
        encouraging: 'Use an encouraging, supportive tone that motivates improvement.',
        critical: 'Be direct and critical, focusing on areas that need improvement.',
        neutral: 'Maintain a neutral, objective tone throughout your analysis.',
        academic: 'Use a formal, academic tone appropriate for scholarly discourse.'
      };
      optimizedPrompt += `\n\nTONE: ${toneInstructions[options.tone]}`;
    }

    // Add focus areas
    if (options.focus && options.focus.length > 0) {
      optimizedPrompt += `\n\nSPECIAL FOCUS AREAS: Pay particular attention to: ${options.focus.join(', ')}`;
    }

    // Add expert level context
    if (options.expertLevel) {
      const expertInstructions = {
        student: 'Explain concepts clearly as if speaking to a student learning to write.',
        teacher: 'Provide insights useful for someone teaching writing to others.',
        professor: 'Include advanced analysis appropriate for academic professionals.',
        professional: 'Focus on practical improvements for professional writing contexts.'
      };
      optimizedPrompt += `\n\nEXPERT LEVEL: ${expertInstructions[options.expertLevel]}`;
    }

    return optimizedPrompt;
  }

  static createCustomTemplate(
    name: string,
    description: string,
    template: string,
    variables: string[],
    category: PromptTemplate['category'],
    difficulty: PromptTemplate['difficulty'],
    responseFormat: PromptTemplate['responseFormat']
  ): PromptTemplate {
    const customTemplate: PromptTemplate = {
      id: `custom-${Date.now()}`,
      name,
      description,
      template,
      variables,
      category,
      difficulty,
      responseFormat
    };

    this.templates.push(customTemplate);
    return customTemplate;
  }

  static generateContextualPrompt(essayText: string, context: {
    assignmentType?: string;
    academicLevel?: string;
    subject?: string;
    specificRequirements?: string[];
    rubric?: string;
  }): string {
    let prompt = `You are an expert writing tutor. Please analyze this ${context.assignmentType || 'essay'} written by a ${context.academicLevel || 'student'}.`;

    if (context.subject) {
      prompt += ` This is for a ${context.subject} course.`;
    }

    if (context.specificRequirements && context.specificRequirements.length > 0) {
      prompt += `\n\nSPECIFIC REQUIREMENTS TO EVALUATE:\n${context.specificRequirements.map(req => `- ${req}`).join('\n')}`;
    }

    if (context.rubric) {
      prompt += `\n\nRUBRIC TO FOLLOW:\n${context.rubric}`;
    }

    prompt += `\n\nESSAY TO ANALYZE:\n"""${essayText}"""`;

    prompt += `\n\nPlease provide structured feedback that includes:
1. Overall assessment and score
2. Specific strengths
3. Areas for improvement
4. Detailed analysis by category
5. Actionable recommendations
6. Examples of improvements

Make your feedback constructive, specific, and actionable.`;

    return prompt;
  }
}

// Response quality checker
export class ResponseQualityChecker {
  static assessResponseQuality(response: string): {
    score: number;
    issues: string[];
    strengths: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const strengths: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check length
    if (response.length < 100) {
      issues.push('Response is too short');
      score -= 20;
    } else if (response.length > 500) {
      strengths.push('Comprehensive response length');
    }

    // Check structure
    if (!response.includes('#') && !response.includes('•') && !response.includes('-')) {
      issues.push('Lacks clear structure or formatting');
      score -= 15;
      suggestions.push('Add headers, bullet points, or lists for better organization');
    } else {
      strengths.push('Well-structured with clear formatting');
    }

    // Check specificity
    const specificTerms = ['specific', 'particular', 'exactly', 'precisely', 'line', 'paragraph'];
    const hasSpecificTerms = specificTerms.some(term => response.toLowerCase().includes(term));
    if (!hasSpecificTerms) {
      issues.push('Lacks specific details or examples');
      score -= 10;
      suggestions.push('Include specific examples and locations in the text');
    } else {
      strengths.push('Includes specific details and examples');
    }

    // Check actionability
    const actionWords = ['change', 'revise', 'add', 'remove', 'improve', 'consider', 'try'];
    const hasActionWords = actionWords.some(word => response.toLowerCase().includes(word));
    if (!hasActionWords) {
      issues.push('Not sufficiently actionable');
      score -= 10;
      suggestions.push('Include more specific action items');
    } else {
      strengths.push('Provides actionable suggestions');
    }

    // Check encouragement
    const encouragingWords = ['good', 'well', 'strong', 'excellent', 'effective'];
    const hasEncouragement = encouragingWords.some(word => response.toLowerCase().includes(word));
    if (!hasEncouragement) {
      issues.push('Lacks positive reinforcement');
      score -= 5;
      suggestions.push('Include some positive feedback to encourage the writer');
    } else {
      strengths.push('Includes encouraging feedback');
    }

    return {
      score: Math.max(0, score),
      issues,
      strengths,
      suggestions
    };
  }
}

export default {
  AIPromptEngineer,
  ResponseQualityChecker
};
