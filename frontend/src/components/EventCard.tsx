import type { Event } from '../types/event';

interface Props {
  event: Event;
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

export default function EventCard({ event }: Props) {
  const formattedDate = new Date(event.date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`event-card event-card--${event.status}`}>
      <div className="event-card__header">
        <span className="event-card__category">{categoryLabels[event.category]}</span>
        <span className={`event-card__status event-card__status--${event.status}`}>
          {statusLabels[event.status]}
        </span>
      </div>
      <h3 className="event-card__title">{event.title}</h3>
      <p className="event-card__description">{event.description}</p>
      <div className="event-card__details">
        <span>{formattedDate}</span>
        <span>{event.location}</span>
        <span>Organiza: {event.organizer}</span>
      </div>
    </div>
  );
}
