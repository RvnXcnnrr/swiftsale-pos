import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for auto-saving form data to localStorage
 * @param {string} formKey - Unique key to identify the form
 * @param {object} initialData - Initial form data
 * @param {number} debounceMs - Debounce time in milliseconds (default: 1000)
 * @returns {object} - { formData, setFormData, clearSavedData, hasSavedData }
 */
const useAutoSave = (formKey, initialData = {}, debounceMs = 1000) => {
    const storageKey = `autosave_${formKey}`;
    
    // Load saved data from localStorage on component mount
    const loadSavedData = useCallback(() => {
        try {
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Merge saved data with initial data, prioritizing saved data
                return { ...initialData, ...parsedData };
            }
        } catch (error) {
            console.warn('Failed to load saved form data:', error);
        }
        return initialData;
    }, [storageKey, initialData]);

    const [formData, setFormData] = useState(loadSavedData);
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Save data to localStorage with debouncing
    const saveToStorage = useCallback((data) => {
        try {
            // Only save non-empty data
            const hasData = Object.values(data).some(value => {
                if (typeof value === 'string') return value.trim() !== '';
                if (typeof value === 'number') return value !== 0;
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === 'object' && value !== null) {
                    return Object.keys(value).length > 0;
                }
                return Boolean(value);
            });

            if (hasData) {
                localStorage.setItem(storageKey, JSON.stringify(data));
            } else {
                localStorage.removeItem(storageKey);
            }
        } catch (error) {
            console.warn('Failed to save form data:', error);
        }
    }, [storageKey]);

    // Debounced save effect
    useEffect(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            saveToStorage(formData);
        }, debounceMs);

        setDebounceTimer(timer);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [formData, debounceMs, saveToStorage]);

    // Clear saved data from localStorage
    const clearSavedData = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
            setFormData(initialData);
        } catch (error) {
            console.warn('Failed to clear saved form data:', error);
        }
    }, [storageKey, initialData]);

    // Check if there's saved data
    const hasSavedData = useCallback(() => {
        try {
            const savedData = localStorage.getItem(storageKey);
            return savedData !== null;
        } catch (error) {
            return false;
        }
    }, [storageKey]);

    // Enhanced setFormData that handles both object updates and function updates
    const setFormDataEnhanced = useCallback((newData) => {
        if (typeof newData === 'function') {
            setFormData(prevData => {
                const updatedData = newData(prevData);
                return updatedData;
            });
        } else {
            setFormData(newData);
        }
    }, []);

    return {
        formData,
        setFormData: setFormDataEnhanced,
        clearSavedData,
        hasSavedData: hasSavedData()
    };
};

export default useAutoSave;
