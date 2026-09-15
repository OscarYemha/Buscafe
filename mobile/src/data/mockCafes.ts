import { Cafe } from "../types/Cafe";

export const mockCafes: Cafe[] = [
    {
    id: '1',
    name: 'Café Martínez',
    rating: 4.4,
    distanceKm: 0.3,
    priceLevel: 2,
    isOpen: true,
    features: ['Wi-Fi', 'Enchufes', 'Comida'],
    intents : ['work', 'study', 'food'],
  },
  {
    id: '2',
    name: 'Negro Cueva de Café',
    rating: 4.7,
    distanceKm: 0.8,
    priceLevel: 3,
    isOpen: true,
    features: ['Buen café', 'Tranquilo'],
    intents: ['coffee', 'date', 'study'],
  },
  {
    id: '3',
    name: 'La Noire Café',
    rating: 4.6,
    distanceKm: 1.2,
    priceLevel: 2,
    isOpen: false,
    features: ['Pet friendly', 'Exterior', 'Comida'],
    intents: ['pet-friendly', 'date', 'food'],
  },
];