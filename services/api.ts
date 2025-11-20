import { FullEventData } from '../types';

// The relative path to your PHP script. 
// When built and deployed, api.php should be in the same root folder as index.html
const API_URL = 'api.php';

export const api = {
  save: async (data: FullEventData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}?action=save`, {
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
      const response = await fetch(`${API_URL}?action=get&id=${id}`);
      
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