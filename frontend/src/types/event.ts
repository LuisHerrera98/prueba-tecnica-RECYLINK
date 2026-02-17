export enum EventCategory {
  WORKSHOP = 'workshop',
  MEETUP = 'meetup',
  TALK = 'talk',
  SOCIAL = 'social',
}

export enum EventStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
  organizer: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
  organizer: string;
  status?: EventStatus;
}
