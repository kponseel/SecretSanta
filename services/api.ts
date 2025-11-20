import { FullEventData } from '../types';

export const api = {
  save: async (data: FullEventData): Promise<boolean> => {
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
      return result.success === true;
    } catch (e) {
      console.error("API save failed", e);
      return false;
    }
  },

  get: async (id: string): Promise<FullEventData | null> => {
    try {
      const cacheBuster = new Date().getTime();
      const response = await fetch(`/api/get?id=${id}&t=${cacheBuster}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Server error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API get failed", error);
      return null;
    }
  }
};