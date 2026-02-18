import { useState, FormEvent } from 'react';
import type { Event, CreateEventPayload } from '../types/event';
import { EventCategory, EventStatus } from '../types/event';

interface Props {
  event: Event;
  onUpdate: (id: string, payload: Partial<CreateEventPayload>) => Promise<void>;
  onBack: () => void;
  canEdit: boolean;
}

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
};

const categoryLabels: Record<string, string> = {
  workshop: 'Workshop',
  meetup: 'Meetup',
  talk: 'Charla',
  social: 'Social',
};

export default function EventDetail({ event, onUpdate, onBack, canEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formattedDate = new Date(event.date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateValue = event.date.slice(0, 10);
  const timeValue = event.date.slice(11, 16);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload: Partial<CreateEventPayload> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: `${formData.get('date')}T${formData.get('time') || '00:00'}`,
      location: formData.get('location') as string,
      category: formData.get('category') as EventCategory,
      status: formData.get('status') as EventStatus,
    };

    try {
      await onUpdate(event._id, payload);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>Editar Evento</h2>

        {error && <p className="event-form__error">{error}</p>}

        <div className="event-form__field">
          <label htmlFor="title">Título</label>
          <input id="title" name="title" type="text" defaultValue={event.title} required />
        </div>

        <div className="event-form__field">
          <label htmlFor="description">Descripción</label>
          <textarea id="description" name="description" rows={3} defaultValue={event.description} required />
        </div>

        <div className="event-form__row">
          <div className="event-form__field">
            <label htmlFor="date">Fecha</label>
            <input id="date" name="date" type="date" defaultValue={dateValue} required />
          </div>
          <div className="event-form__field">
            <label htmlFor="time">Hora</label>
            <input id="time" name="time" type="time" defaultValue={timeValue} required />
          </div>
        </div>

        <div className="event-form__field">
          <label htmlFor="location">Ubicación</label>
          <input id="location" name="location" type="text" defaultValue={event.location} required />
        </div>

        <div className="event-form__row">
          <div className="event-form__field">
            <label htmlFor="category">Categoría</label>
            <select id="category" name="category" defaultValue={event.category} required>
              {Object.values(EventCategory).map((cat) => (
                <option key={cat} value={cat}>{categoryLabels[cat]}</option>
              ))}
            </select>
          </div>
          <div className="event-form__field">
            <label htmlFor="status">Estado</label>
            <select id="status" name="status" defaultValue={event.status}>
              {Object.values(EventStatus).map((st) => (
                <option key={st} value={st}>{statusLabels[st]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="event-form__actions">
          <button type="button" onClick={() => setEditing(false)} disabled={loading}>Cancelar</button>
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="event-detail">
      <div className="event-detail__header">
        <button className="event-detail__back" onClick={onBack}>Volver</button>
        {canEdit && (
          <button className="event-detail__edit" onClick={() => setEditing(true)}>Editar</button>
        )}
      </div>

      <div className="event-detail__meta">
        <span className="event-card__category">{categoryLabels[event.category]}</span>
        <span className={`event-card__status event-card__status--${event.status}`}>
          {statusLabels[event.status]}
        </span>
      </div>

      <h2 className="event-detail__title">{event.title}</h2>
      <p className="event-detail__description">{event.description}</p>

      <div className="event-detail__info">
        <div className="event-detail__info-item">
          <strong>Fecha</strong>
          <span>{formattedDate}</span>
        </div>
        <div className="event-detail__info-item">
          <strong>Ubicación</strong>
          <span>{event.location}</span>
        </div>
        <div className="event-detail__info-item">
          <strong>Organizador</strong>
          <span>{event.organizer}</span>
        </div>
      </div>
    </div>
  );
}
