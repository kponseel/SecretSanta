import { FullEventData } from '../types';

const STORAGE_PREFIX = 'sso_evt_';

export const api = {
  save: async (data: FullEventData): Promise<{ success: boolean; mode: 'server' | 'local' }> => {
    try {
      // Use the local Node.js API route
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      return { success: result.success === true, mode: 'server' };
    } catch (e) {
      console.warn("API save failed, falling back to LocalStorage", e);
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${data.details.id}`, JSON.stringify(data));
        return { success: true, mode: 'local' };
      } catch (localErr) {
        console.error("LocalStorage save failed", localErr);
        return { success: false, mode: 'local' };
      }
    }
  },

  get: async (id: string): Promise<FullEventData | null> => {
    // 1. Try API First
    try {
      const cacheBuster = new Date().getTime();
      const response = await fetch(`/api/get?id=${id}&t=${cacheBuster}`);
      
      if (!response.ok) {
        // If 404 or other error, throw to trigger fallback
        throw new Error(`Server error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("API get failed, checking LocalStorage", error);
      
      // 2. Fallback to LocalStorage
      const local = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (local) {
        try {
          return JSON.parse(local);
        } catch (e) {
          console.error("Error parsing local data", e);
          return null;
        }
      }
      return null;
    }
  }
};