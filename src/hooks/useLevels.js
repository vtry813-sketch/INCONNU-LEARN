import { useState, useEffect } from 'react';
import { levelService } from '../services/levels';

export const useLevels = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        const levelsData = await levelService.getLevels();
        setLevels(levelsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching levels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const getLevel = (id) => {
    return levels.find(level => level._id === id || level.id === id);
  };

  const getLevelByNumber = (number) => {
    return levels.find(level => level.levelNumber === number);
  };

  return {
    levels,
    loading,
    error,
    getLevel,
    getLevelByNumber,
    refetch: () => {
      setLoading(true);
      levelService.getLevels()
        .then(setLevels)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  };
};
