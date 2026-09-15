import { Cafe } from "../types/Cafe";
import { CafeIntent } from "../types/CafeIntent";

export function rankCafeByIntent(
    cafes: Cafe[],
    intent: CafeIntent
): Cafe[]{
    return [...cafes].sort((a,b) => {
        const aMatchesIntent = a.intents.includes(intent);
        const bMatchesIntent = b.intents.includes(intent);

        if (aMatchesIntent && !bMatchesIntent)
        {
            return -1;
        }

        if (!aMatchesIntent && bMatchesIntent)
        {
            return 1;
        }

        return b.rating - a.rating;
    });
}