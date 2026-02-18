import { useEffect, useState, useCallback } from 'react';
import type { Event, CreateEventPayload } from './types/event';
import type { AuthUser } from './types/auth';
import { EventCategory, EventStatus } from './types/event';
import { getEvents, createEvent, updateEvent, removeToken } from './services/api';
import EventCard from './components/EventCard';
import EventDetail from './components/EventDetail';
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  const handleUpdate = async (id: string, payload: Partial<CreateEventPayload>) => {
    const updated = await updateEvent(id, payload);
    setSelectedEvent(updated);
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

  const currentView = () => {
    if (showAuth && !user) {
      return <AuthForm onAuth={handleAuth} />;
    }

    if (showForm && user) {
      return <EventForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} userName={user?.name} />;
    }

    if (selectedEvent) {
      return (
        <EventDetail
          event={selectedEvent}
          onUpdate={handleUpdate}
          onBack={() => setSelectedEvent(null)}
          canEdit={!!user}
        />
      );
    }

    return (
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
            <EventCard key={event._id} event={event} onClick={() => setSelectedEvent(event)} />
          ))}
        </div>
      </main>
    );
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__logo" onClick={() => { setSelectedEvent(null); setShowForm(false); setShowAuth(false); }}>EventBoard</h1>
        <div className="app__header-actions">
          {user ? (
            <>
              <span className="app__user">{user.name}</span>
              <button onClick={() => { setShowForm(!showForm); setSelectedEvent(null); }}>
                {showForm ? 'Ver Eventos' : 'Nuevo Evento'}
              </button>
              <button className="app__btn-secondary" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <button onClick={() => { setShowAuth(!showAuth); setSelectedEvent(null); }}>
              {showAuth ? 'Ver Eventos' : 'Iniciar Sesión'}
            </button>
          )}
        </div>
      </header>

      {currentView()}
    </div>
  );
}

export default App;
