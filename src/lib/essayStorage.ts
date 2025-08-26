import { EssayHistory } from '@/types/user';
import { EssayAnalysis } from '@/types/essay';

const ESSAYS_STORAGE_KEY = 'user_essays';

export function saveEssay(
  userId: string, 
  title: string, 
  content: string, 
  analysis: EssayAnalysis
): EssayHistory {
  const newEssay: EssayHistory = {
    id: generateId(),
    title: title || generateTitle(content),
    content,
    analysis,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Get existing essays for this user
  const existingEssays = getUserEssays(userId);
  
  // Add new essay
  const updatedEssays = [newEssay, ...existingEssays];
  
  // Store back to localStorage
  const allUserEssays = getAllUserEssays();
  allUserEssays[userId] = updatedEssays;
  localStorage.setItem(ESSAYS_STORAGE_KEY, JSON.stringify(allUserEssays));
  
  return newEssay;
}

export function getUserEssays(userId: string): EssayHistory[] {
  const allUserEssays = getAllUserEssays();
  return allUserEssays[userId] || [];
}

export function getAllUserEssays(): Record<string, EssayHistory[]> {
  try {
    const stored = localStorage.getItem(ESSAYS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading essays:', error);
    return {};
  }
}

export function getUserStats(userId: string) {
  const essays = getUserEssays(userId);
  
  if (essays.length === 0) {
    return {
      totalEssays: 0,
      averageScore: 0,
      improvementRate: 0,
      recentScores: []
    };
  }

  const scores = essays.map(essay => essay.analysis.totalMarks);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  // Calculate improvement rate (compare first half vs second half of essays)
  let improvementRate = 0;
  if (essays.length >= 4) {
    const midPoint = Math.floor(essays.length / 2);
    const firstHalf = scores.slice(midPoint);
    const secondHalf = scores.slice(0, midPoint);
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    if (firstAvg > 0) {
      improvementRate = ((secondAvg - firstAvg) / firstAvg) * 100;
    }
  }

  return {
    totalEssays: essays.length,
    averageScore: Math.round(averageScore * 10) / 10,
    improvementRate: Math.round(improvementRate * 10) / 10,
    recentScores: scores.slice(0, 10) // Last 10 scores
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateTitle(content: string): string {
  const words = content.trim().split(/\s+/).slice(0, 6);
  let title = words.join(' ');
  if (content.trim().split(/\s+/).length > 6) {
    title += '...';
  }
  return title || 'Untitled Essay';
}
