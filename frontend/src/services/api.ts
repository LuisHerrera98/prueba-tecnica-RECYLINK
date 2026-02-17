import type { Event, CreateEventPayload } from '../types/event';
import { EventCategory, EventStatus } from '../types/event';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getEvents(category?: EventCategory, status?: EventStatus): Promise<Event[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (status) params.append('status', status);

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_URL}/events${query}`);

  if (!response.ok) throw new Error('Error al cargar los eventos');
  return response.json();
}

export async function getEvent(id: string): Promise<Event> {
  const response = await fetch(`${API_URL}/events/${id}`);
  if (!response.ok) throw new Error('Evento no encontrado');
  return response.json();
}

export async function createEvent(payload: CreateEventPayload): Promise<Event> {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message?.join(', ') || 'Error al crear el evento');
  }
  return response.json();
}
