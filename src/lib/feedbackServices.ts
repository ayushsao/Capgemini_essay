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
}

// Add feedback to Firebase
export const addFeedback = async (feedbackData: Omit<FeedbackData, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'feedbacks'), feedbackData);
    console.log('✅ Feedback added to Firebase with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding feedback to Firebase:', error);
    throw error;
  }
};

// Get all feedbacks from Firebase
export const getFeedbacks = async (): Promise<FeedbackData[]> => {
  try {
    const q = query(collection(db, 'feedbacks'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const feedbacks: FeedbackData[] = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({
        id: doc.id,
        ...doc.data()
      } as FeedbackData);
    });
    
    console.log('✅ Loaded feedbacks from Firebase:', feedbacks.length);
    return feedbacks;
  } catch (error) {
    console.error('❌ Error loading feedbacks from Firebase:', error);
    throw error;
  }
};

// Update feedback status
export const updateFeedbackStatus = async (id: string, status: 'new' | 'reviewed' | 'resolved'): Promise<void> => {
  try {
    const feedbackRef = doc(db, 'feedbacks', id);
    await updateDoc(feedbackRef, { status });
    console.log('✅ Feedback status updated in Firebase');
  } catch (error) {
    console.error('❌ Error updating feedback status:', error);
    throw error;
  }
};

// Delete feedback
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'feedbacks', id));
    console.log('✅ Feedback deleted from Firebase');
  } catch (error) {
    console.error('❌ Error deleting feedback:', error);
    throw error;
  }
};
