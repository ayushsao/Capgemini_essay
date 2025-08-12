import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface FeedbackData {
  id?: string;
  feedback: string;
  email?: string;
  rating: number;
  category: string;
  timestamp: string;
  status: 'new' | 'reviewed' | 'resolved';
  submittedBy?: string; // Track who submitted the feedback
  userAgent?: string; // Track browser/device info
}

// Add feedback to Firebase
export const addFeedback = async (feedbackData: Omit<FeedbackData, 'id'>): Promise<string> => {
  try {
    console.log('🔥 Attempting to add feedback to Firebase:', feedbackData);
    
    // Add browser info for better tracking
    const enhancedData = {
      ...feedbackData,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      submittedBy: feedbackData.email || 'anonymous',
      timestamp: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'feedbacks'), enhancedData);
    console.log('✅ Feedback successfully added to Firebase with ID:', docRef.id);
    console.log('📊 Document data:', enhancedData);
    return docRef.id;
  } catch (error) {
    console.error('❌ Detailed Firebase error adding feedback:', error);
    console.error('🔍 Error code:', (error as any)?.code);
    console.error('🔍 Error message:', (error as any)?.message);
    throw error;
  }
};

// Get all feedbacks from Firebase
export const getFeedbacks = async (): Promise<FeedbackData[]> => {
  try {
    console.log('🔍 Attempting to fetch feedbacks from Firebase...');
    
    const q = query(collection(db, 'feedbacks'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const feedbacks: FeedbackData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      feedbacks.push({
        id: doc.id,
        ...data
      } as FeedbackData);
      console.log('📄 Loaded feedback document:', { id: doc.id, data });
    });
    
    console.log('✅ Successfully loaded feedbacks from Firebase:', feedbacks.length, 'total');
    console.log('📊 Feedback details:', feedbacks.map(f => ({ 
      id: f.id, 
      rating: f.rating, 
      category: f.category, 
      submittedBy: f.submittedBy,
      timestamp: f.timestamp 
    })));
    
    return feedbacks;
  } catch (error) {
    console.error('❌ Detailed Firebase error loading feedbacks:', error);
    console.error('🔍 Error code:', (error as any)?.code);
    console.error('🔍 Error message:', (error as any)?.message);
    console.error('🔍 Full error object:', error);
    throw error;
  }
};

// Update feedback status
export const updateFeedbackStatus = async (id: string, status: 'new' | 'reviewed' | 'resolved'): Promise<void> => {
  try {
    console.log('🔄 Updating feedback status in Firebase:', { id, status });
    const feedbackRef = doc(db, 'feedbacks', id);
    await updateDoc(feedbackRef, { status });
    console.log('✅ Feedback status updated in Firebase');
  } catch (error) {
    console.error('❌ Error updating feedback status:', error);
    console.error('🔍 Error code:', (error as any)?.code);
    console.error('🔍 Error message:', (error as any)?.message);
    throw error;
  }
};

// Delete feedback
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting feedback from Firebase:', id);
    await deleteDoc(doc(db, 'feedbacks', id));
    console.log('✅ Feedback deleted from Firebase');
  } catch (error) {
    console.error('❌ Error deleting feedback:', error);
    console.error('🔍 Error code:', (error as any)?.code);
    console.error('🔍 Error message:', (error as any)?.message);
    throw error;
  }
};
