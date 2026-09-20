import { CafeSummary } from "./CafeSummary";

export type CafeDetail = CafeSummary & {
    currentOpeningHours: string[];
    regularOpeningHours: string[];

    website: string | null;
    phone: string | null;
    googleMapsUrl: string | null;
};