import { useEffect, useState, useCallback } from 'react';
import type { Event, CreateEventPayload } from './types/event';
import { EventCategory, EventStatus } from './types/event';
import { getEvents, createEvent } from './services/api';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import EventForm from './components/EventForm';
import './App.css';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEvents(
        category as EventCategory || undefined,
        status as EventStatus || undefined,
      );
      setEvents(data);
    } catch {
      setError('No se pudieron cargar los eventos');
    } finally {
      setLoading(false);
    }
  }, [category, status]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreate = async (payload: CreateEventPayload) => {
    await createEvent(payload);
    setShowForm(false);
    fetchEvents();
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>EventBoard</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Ver Eventos' : 'Nuevo Evento'}
        </button>
      </header>

      {showForm ? (
        <EventForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      ) : (
        <main>
          <EventFilters
            category={category}
            status={status}
            onCategoryChange={setCategory}
            onStatusChange={setStatus}
          />

          {loading && <p className="app__message">Cargando eventos...</p>}
          {error && <p className="app__message app__message--error">{error}</p>}
          {!loading && !error && events.length === 0 && (
            <p className="app__message">No hay eventos</p>
          )}

          <div className="event-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
