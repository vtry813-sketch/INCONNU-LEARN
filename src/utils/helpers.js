// Format numbers with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Generate random color based on string
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'
  ];
  return colors[Math.abs(hash) % colors.length];
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Calculate level progress percentage
export const calculateProgress = (currentLevel, totalLevels = 50) => {
  return Math.round((currentLevel / totalLevels) * 100);
};

// Format time spent
export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Get difficulty badge color
export const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: 'var(--secondary-color)',
    intermediate: 'var(--accent-color)',
    advanced: 'var(--danger-color)',
    expert: 'var(--primary-color)'
  };
  return colors[difficulty] || colors.beginner;
};
