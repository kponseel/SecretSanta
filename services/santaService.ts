import { Participant, Pairing, TicketData } from '../types';

// Base64 UTF-8 Safe Encoding
export const encodeTicket = (data: TicketData): string => {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
};

export const decodeTicket = (code: string): TicketData | null => {
  try {
    const json = decodeURIComponent(escape(window.atob(code)));
    return JSON.parse(json);
  } catch (e) {
    console.error("Invalid ticket code", e);
    return null;
  }
};

export const parseCSV = (csvText: string): Partial<Participant>[] => {
  const lines = csvText.split(/\r?\n/);
  const participants: Partial<Participant>[] = [];
  
  lines.forEach(line => {
    const parts = line.split(',');
    if (parts.length >= 2) {
      const [name, email, group] = parts.map(p => p.trim());
      if (name && email) {
        participants.push({ name, email, group: group || undefined });
      }
    }
  });
  return participants;
};

export const generateDraw = (participants: Participant[]): Pairing[] | null => {
  if (participants.length < 2) return null;

  const maxRetries = 1000;
  let attempt = 0;

  while (attempt < maxRetries) {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const pairings: Pairing[] = [];
    let valid = true;

    for (let i = 0; i < participants.length; i++) {
      const giver = participants[i];
      const receiver = shuffled[i];

      // Constraint 1: Cannot draw self
      if (giver.id === receiver.id) {
        valid = false;
        break;
      }

      // Constraint 2: Exclusion Group
      if (giver.group && receiver.group && 
          giver.group.toLowerCase() === receiver.group.toLowerCase()) {
        valid = false;
        break;
      }

      pairings.push({ giver, receiver });
    }

    if (valid) {
      return pairings;
    }

    attempt++;
  }

  return null;
};
