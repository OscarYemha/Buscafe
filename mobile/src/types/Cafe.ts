import { CafeIntent } from "./CafeIntent";

export type Cafe = {
    id: string;
    name: string;
    rating: number;
    distanceKm: number;
    priceLevel: 1 | 2 | 3 | 4;
    isOpen: boolean;
    features: string[];
    intents: CafeIntent[];
};