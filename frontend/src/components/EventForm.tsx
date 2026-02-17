import { useState, FormEvent } from 'react';
import type { CreateEventPayload } from '../types/event';
import { EventCategory, EventStatus } from '../types/event';

interface Props {
  onSubmit: (payload: CreateEventPayload) => Promise<void>;
  onCancel: () => void;
  userName?: string;
}

export default function EventForm({ onSubmit, onCancel, userName }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload: CreateEventPayload = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: `${formData.get('date')}T${formData.get('time') || '00:00'}`,
      location: formData.get('location') as string,
      category: formData.get('category') as EventCategory,
      organizer: formData.get('organizer') as string,
      status: formData.get('status') as EventStatus,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2>Nuevo Evento</h2>

      {error && <p className="event-form__error">{error}</p>}

      <div className="event-form__field">
        <label htmlFor="title">Título</label>
        <input id="title" name="title" type="text" required />
      </div>

      <div className="event-form__field">
        <label htmlFor="description">Descripción</label>
        <textarea id="description" name="description" rows={3} required />
      </div>

      <div className="event-form__row">
        <div className="event-form__field">
          <label htmlFor="date">Fecha</label>
          <input id="date" name="date" type="date" required />
        </div>

        <div className="event-form__field">
          <label htmlFor="time">Hora</label>
          <input id="time" name="time" type="time" required />
        </div>
      </div>

      <div className="event-form__field">
        <label htmlFor="location">Ubicación</label>
        <input id="location" name="location" type="text" required />
      </div>

      <div className="event-form__row">
        <div className="event-form__field">
          <label htmlFor="category">Categoría</label>
          <select id="category" name="category" required>
            {Object.values(EventCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="event-form__field">
          <label htmlFor="status">Estado</label>
          <select id="status" name="status">
            {Object.values(EventStatus).map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="event-form__field">
        <label htmlFor="organizer">Organizador</label>
        <input id="organizer" name="organizer" type="text" defaultValue={userName} readOnly={!!userName} />
      </div>

      <div className="event-form__actions">
        <button type="button" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Evento'}
        </button>
      </div>
    </form>
  );
}
