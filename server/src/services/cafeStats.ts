import prisma from "../lib/prisma";

export type CafeStats = {
    rating: number | null;
    reviewsCount: number;
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
                select: {
                    rating: true,
                },
            },
        },
    });

    if (!cafe || cafe.reviews.length === 0)
    {
        return {
            rating: null,
            reviewsCount: 0,
        };
    }

    const totalRating = cafe.reviews.reduce(
        (total, review) =>
            total + review.rating,
        0
    );

    return {
        rating: totalRating / cafe.reviews.length,

        reviewsCount: cafe.reviews.length,
    }
}