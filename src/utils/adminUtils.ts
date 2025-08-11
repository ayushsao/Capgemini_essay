import { User } from '@/types/user';

// Admin user email(s)
const ADMIN_EMAILS = ['ayushsao32@gmail.com'];

/**
 * Check if a user is an admin
 * @param user - The user object
 * @returns true if user is admin, false otherwise
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user || !user.email) {
    return false;
  }
  
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
};

/**
 * Check if the current authenticated user is an admin
 * @param user - The current user from auth context
 * @returns true if current user is admin, false otherwise
 */
export const isCurrentUserAdmin = (user: User | null): boolean => {
  return isAdmin(user);
};
