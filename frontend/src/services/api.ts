import type { Event, CreateEventPayload } from '../types/event';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';
import { EventCategory, EventStatus } from '../types/event';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Credenciales inválidas');
  return response.json();
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrarse');
  }
  return response.json();
}

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
  const token = getToken();
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message?.join?.(', ') || error.message || 'Error al crear el evento');
  }
  return response.json();
}
