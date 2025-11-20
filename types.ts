
export type Language = 'en' | 'fr' | 'es';

export interface Participant {
  id: string;
  name: string;
  email: string;
  group?: string; // Exclusion group (e.g., "Couple A")
  department?: string;
  wishlist?: string;
}

export interface EventDetails {
  id: string; // Unique ID for the event
  eventName: string;
  organizerName?: string;
  organizerEmail: string; // For the management link
  budget: string;
  exchangeDate: string;
  drawDate: string;
  message: string;
}

export interface FullEventData {
  details: EventDetails;
  participants: Participant[];
  pairings: Pairing[];
}

export interface Pairing {
  giver: Participant;
  receiver: Participant;
}

export enum AppStep {
  CREATE = 'create',
  CREATED = 'created',
  DASHBOARD = 'dashboard',
}

export enum DashboardTab {
  SETUP = 'setup',
  PARTICIPANTS = 'participants',
  DRAW = 'draw',
  SHARE = 'share',
}

export interface TicketData {
  n: string; // name
  e: string; // email
  g?: string; // group
  d?: string; // department
  w?: string; // wishlist
}
