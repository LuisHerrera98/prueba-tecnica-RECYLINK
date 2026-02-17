import { EventCategory, EventStatus } from '../types/event';
import Dropdown from './Dropdown';

interface Props {
  category: string;
  status: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const categoryOptions = Object.values(EventCategory).map((cat) => ({
  label: cat.charAt(0).toUpperCase() + cat.slice(1),
  value: cat,
}));

const statusOptions = [
  { label: 'Borrador', value: EventStatus.DRAFT },
  { label: 'Confirmado', value: EventStatus.CONFIRMED },
  { label: 'Cancelado', value: EventStatus.CANCELLED },
];

export default function EventFilters({ category, status, onCategoryChange, onStatusChange }: Props) {
  return (
    <div className="event-filters">
      <Dropdown
        options={categoryOptions}
        value={category}
        placeholder="Todas las categorías"
        onChange={onCategoryChange}
      />
      <Dropdown
        options={statusOptions}
        value={status}
        placeholder="Todos los estados"
        onChange={onStatusChange}
      />
    </div>
  );
}
