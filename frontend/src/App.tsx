import { useEffect, useState, useCallback } from 'react';
import type { Event, CreateEventPayload } from './types/event';
import type { AuthUser } from './types/auth';
import { EventCategory, EventStatus } from './types/event';
import { getEvents, createEvent, removeToken } from './services/api';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import EventForm from './components/EventForm';
import AuthForm from './components/AuthForm';
import './App.css';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);

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

  const handleAuth = (authUser: AuthUser) => {
    setUser(authUser);
    setShowAuth(false);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setShowForm(false);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>EventBoard</h1>
        <div className="app__header-actions">
          {user ? (
            <>
              <span className="app__user">{user.name}</span>
              <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ver Eventos' : 'Nuevo Evento'}
              </button>
              <button className="app__btn-secondary" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <button onClick={() => setShowAuth(!showAuth)}>
              {showAuth ? 'Ver Eventos' : 'Iniciar Sesión'}
            </button>
          )}
        </div>
      </header>

      {showAuth && !user ? (
        <AuthForm onAuth={handleAuth} />
      ) : showForm && user ? (
        <EventForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} userName={user?.name} />
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
