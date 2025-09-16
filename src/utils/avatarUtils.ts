// Profile picture utilities for handling Google auth avatars and fallbacks

export const getInitials = (name: string): string => {
  if (!name) return 'U';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export const generateGradientColors = (name: string): string => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-red-500 to-orange-600',
    'from-yellow-500 to-red-600',
    'from-indigo-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-violet-500 to-purple-600'
  ];
  
  // Use name hash to consistently select same color for same user
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  // Check for common image URLs
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const hasImageExtension = imageExtensions.test(url);
  
  // Check for Google profile pictures or other common avatar services
  const isGoogleProfile = url.includes('googleusercontent.com');
  const isGravatarProfile = url.includes('gravatar.com');
  const isFirebaseStorage = url.includes('firebasestorage.googleapis.com');
  
  return hasImageExtension || isGoogleProfile || isGravatarProfile || isFirebaseStorage;
};

export const getAvatarProps = (user: { name: string; avatar?: string }) => {
  const initials = getInitials(user.name);
  const gradientColors = generateGradientColors(user.name);
  const hasValidAvatar = user.avatar && isValidImageUrl(user.avatar);
  
  return {
    initials,
    gradientColors,
    hasValidAvatar,
    avatarUrl: hasValidAvatar ? user.avatar : null
  };
};

// Helper function for creating avatar element ID
export const getAvatarId = (userId: string, type: 'main' | 'dropdown' = 'main'): string => {
  return `avatar-${type}-${userId}`;
};

// Helper function for handling avatar load errors
export const handleAvatarError = (event: Event, fallbackClass: string = 'avatar-fallback') => {
  const target = event.currentTarget as HTMLImageElement;
  const parent = target.parentElement;
  const fallback = parent?.querySelector(`.${fallbackClass}`) as HTMLElement;
  
  if (fallback && parent) {
    target.style.display = 'none';
    fallback.style.display = 'flex';
    fallback.classList.remove('hidden');
  }
};