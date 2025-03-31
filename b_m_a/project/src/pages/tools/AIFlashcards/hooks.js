import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { getToken } from '../../../utils/auth';

export const useFlashcardData = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedFlashcards, setSavedFlashcards] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const flashcardsFetchedRef = useRef(false);

  // Fetch saved flashcards
  const fetchSavedFlashcards = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://localhost:8000/saved-flashcards', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedFlashcards(response.data);
      flashcardsFetchedRef.current = true;
    } catch (err) {
      console.error('Error fetching saved flashcards:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch saved flashcards');
    }
  }, []);

  // Generate new flashcards
  const generateFlashcards = useCallback(
    async (selectedFile, numCards, selectedTopics, customTopics) => {
      try {
        setIsLoading(true);
        setError(null);
        const token = await getToken();

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('num_cards', numCards);

        // Combine selected topics and custom topics
        const allTopics = [...selectedTopics];
        if (customTopics) {
          allTopics.push(...customTopics.split(',').map((t) => t.trim()));
        }
        formData.append('focus_topics', allTopics.join(', '));

        // Send the file to the backend API
        const response = await axios.post(
          'http://localhost:8000/generate-flashcards',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setFlashcards(response.data);
        return response.data;
      } catch (err) {
        console.error('Error generating flashcards:', err);
        throw new Error(
          err.response?.data?.detail || err.message || 'Failed to generate flashcards'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Save flashcards
  const saveFlashcards = useCallback(
    async (generatedFlashcards, selectedFile, numCards, selectedTopics, customTopics) => {
      if (!generatedFlashcards) return;

      try {
        setIsSaving(true);
        setSaveSuccess(false);
        const token = await getToken();

        // Prepare flashcard data
        const flashcardData = {
          contentType: 'flashcards',
          data: {
            title: generatedFlashcards.title,
            cards: generatedFlashcards.cards,
            resourceName: selectedFile ? selectedFile.name : 'Unknown resource',
            options: {
              numCards,
              selectedTopics,
              customTopics,
            },
          },
        };

        // Save to API
        const response = await axios.post(
          'http://localhost:8000/save-flashcards',
          flashcardData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setSaveSuccess(true);
        flashcardsFetchedRef.current = false;
        await fetchSavedFlashcards();
        return response.data;
      } catch (error) {
        console.error('Error saving flashcards:', error);
        setError(
          'Failed to save flashcards: ' +
            (error.response?.data?.message || error.message)
        );
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchSavedFlashcards]
  );

  return {
    flashcards,
    isLoading,
    error,
    savedFlashcards,
    isSaving,
    saveSuccess,
    flashcardsFetchedRef,
    fetchSavedFlashcards,
    generateFlashcards,
    saveFlashcards,
  };
}; 