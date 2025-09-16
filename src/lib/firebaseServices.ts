import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '@/types/user';
import { EssayHistory } from '@/types/user';

// Users Collection
export const usersCollection = collection(db, 'users');
export const essaysCollection = collection(db, 'essays');

// User Management Functions
export const createUser = async (userData: Omit<User, 'id'>) => {
  try {
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as User);
    });
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Essay Management Functions
export const saveEssay = async (essayData: Omit<EssayHistory, 'id'>) => {
  try {
    const docRef = await addDoc(essaysCollection, {
      ...essayData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving essay:', error);
    throw error;
  }
};

export const getUserEssaysFromFirebase = async (userId: string): Promise<EssayHistory[]> => {
  try {
    const q = query(
      essaysCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const essays: EssayHistory[] = [];
    querySnapshot.forEach((doc) => {
      essays.push({ id: doc.id, ...doc.data() } as EssayHistory);
    });
    return essays;
  } catch (error) {
    console.error('Error getting user essays:', error);
    throw error;
  }
};

export const updateEssay = async (essayId: string, updates: Partial<EssayHistory>) => {
  try {
    const essayDoc = doc(db, 'essays', essayId);
    await updateDoc(essayDoc, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating essay:', error);
    throw error;
  }
};

export const deleteEssay = async (essayId: string) => {
  try {
    await deleteDoc(doc(db, 'essays', essayId));
  } catch (error) {
    console.error('Error deleting essay:', error);
    throw error;
  }
};

// Get all essays (for admin)
export const getAllEssays = async (): Promise<EssayHistory[]> => {
  try {
    const q = query(essaysCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const essays: EssayHistory[] = [];
    querySnapshot.forEach((doc) => {
      essays.push({ id: doc.id, ...doc.data() } as EssayHistory);
    });
    return essays;
  } catch (error) {
    console.error('Error getting all essays:', error);
    throw error;
  }
};
