import prisma from "../lib/prisma";

export type CafeReview = {
    id: number;
    rating: number;
    comment: string;
    createdAt: Date;

    coffeeRating: number | null;
    foodRating: number | null;
    serviceRating: number | null;
    comfortRating: number | null;
    quietRating: number | null;

    goodForWork: boolean | null;
    goodForStudy: boolean | null;
    goodForDate: boolean | null;

    user: {
        id: number;
        name: string;
    };
};

export type CafeStats = {
    rating: number | null;
    reviewsCount: number;
    reviews: CafeReview[];
};

export async function getCafeStats(
    googlePlaceId: string
): Promise<CafeStats> {
    const cafe = await prisma.cafe.findUnique({
        where: {
            googlePlaceId,
        },
        select: {
            reviews: {
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,

                    coffeeRating: true,
                    foodRating: true,
                    serviceRating: true,
                    comfortRating: true,
                    quietRating: true,

                    goodForWork: true,
                    goodForStudy: true,
                    goodForDate: true,

                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!cafe || cafe.reviews.length === 0)
    {
        return {
            rating: null,
            reviewsCount: 0,
            reviews: [],
        };
    }

    const totalRating = cafe.reviews.reduce(
        (total, review) =>
            total + review.rating,
        0
    );

    return {
        rating:
            totalRating /
            cafe.reviews.length,

        reviewsCount:
            cafe.reviews.length,

        reviews:
            cafe.reviews,
    };
}