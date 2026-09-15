import { CafeIntent } from '../types/CafeIntent';

export type CafeIntentOption = {
  id: CafeIntent;
  icon: string;
  label: string;
  description: string;
};

export const cafeIntents: CafeIntentOption[] = [
  {
    id: 'work',
    icon: '💻',
    label: 'Trabajar',
    description: 'trabajar',
  },
  {
    id: 'date',
    icon: '❤️',
    label: 'Una cita',
    description: 'una cita',
  },
  {
    id: 'study',
    icon: '📚',
    label: 'Estudiar',
    description: 'estudiar',
  },
  {
    id: 'coffee',
    icon: '☕',
    label: 'Buen café',
    description: 'disfrutar un buen café',
  },
  {
    id: 'pet-friendly',
    icon: '🐕',
    label: 'Pet friendly',
    description: 'ir con mascota',
  },
  {
    id: 'food',
    icon: '🍰',
    label: 'Comer algo',
    description: 'comer algo',
  },
];