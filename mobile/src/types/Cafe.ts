import { CafeIntent } from "./CafeIntent";
import { Review } from "./Review";

export type Cafe = {
    id: string;
    name: string;
    googleRating: number;
    googleReviewsCount: number;
    buscafeRating: number | null;
    buscafeReviewsCount: number;
    distanceKm: number;
    priceLevel: 1 | 2 | 3 | 4;
    isOpen: boolean;
    address: string;
    hours: string;
    features: string[];
    intents: CafeIntent[];
    website: string | null;
    instagram: string | null;
    phone: string | null;
    whatsapp: string | null;
    reviews: Review[];
};