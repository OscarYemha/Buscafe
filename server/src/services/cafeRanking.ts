type RankableCafe = {
    distanceKm: number | null;

    goodForWorkPercentage: number | null;
    goodForStudyPercentage: number | null;
    goodForDatePercentage: number | null;
    coffeeRating: number | null;
    foodRating: number | null;
    allowsDogs: boolean | null;
};

type RecommendationIntent =
    | 'work'
    | 'study'
    | 'date';

function getRecommendationPercentage(
    cafe: RankableCafe,
    intent: RecommendationIntent
): number | null
{
    switch (intent)
    {
        case 'work':
            return cafe.goodForWorkPercentage;

        case 'study':
            return cafe.goodForStudyPercentage;

        case 'date':
            return cafe.goodForDatePercentage;
    }
}

export function filterCafesByRecommendation<
    T extends RankableCafe
>(
    cafes: T[],
    intent: RecommendationIntent
): T[]
{
    return cafes
        .filter((cafe) => {
            const percentage =
                getRecommendationPercentage(
                    cafe,
                    intent
                );

            return (
                percentage !== null &&
                percentage > 50
            );
        })
        .sort((a, b) => {
            if (a.distanceKm === null)
            {
                return 1;
            }

            if (b.distanceKm === null)
            {
                return -1;
            }

            return a.distanceKm - b.distanceKm;
        });
}

type RatingIntent =
    | 'coffee'
    | 'food';

function getIntentRating(
    cafe: RankableCafe,
    intent: RatingIntent
): number | null
{
    switch (intent)
    {
        case 'coffee':
            return cafe.coffeeRating;

        case 'food':
            return cafe.foodRating;
    }
}

export function filterCafesByRating<
    T extends RankableCafe
>(
    cafes: T[],
    intent: RatingIntent
): T[]
{
    return cafes
        .filter((cafe) => {
            const rating =
                getIntentRating(
                    cafe,
                    intent
                );

            return (
                rating !== null &&
                rating >= 4
            );
        })
        .sort((a, b) => {
            if (a.distanceKm === null)
            {
                return 1;
            }

            if (b.distanceKm === null)
            {
                return -1;
            }

            return a.distanceKm - b.distanceKm;
        });
}

export function filterPetFriendlyCafes<
    T extends RankableCafe
>(
    cafes: T[]
): T[]
{
    return cafes
        .filter(
            cafe => cafe.allowsDogs === true
        )
        .sort((a, b) => {
            if (a.distanceKm === null)
            {
                return 1;
            }

            if (b.distanceKm === null)
            {
                return -1;
            }

            return a.distanceKm - b.distanceKm;
        });
}