import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await userService.getProfile();
      setUserData(data.user);
      setProgress(data.progress || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (levelId, score) => {
    try {
      const updatedProgress = await userService.updateProgress(levelId, score);
      setProgress(updatedProgress);
      return updatedProgress;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const unlockLevel = async (levelId) => {
    try {
      const response = await userService.unlockLevel(levelId);
      setUserData(prev => ({
        ...prev,
        coins: response.coins,
        unlockedLevels: response.unlockedLevels
      }));
      return response;
    } catch (error) {
      console.error('Error unlocking level:', error);
      throw error;
    }
  };

  const value = {
    userData,
    progress,
    loading,
    fetchUserData,
    updateProgress,
    unlockLevel
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
