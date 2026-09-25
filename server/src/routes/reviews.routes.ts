import { Router } from "express";
import prisma from "../lib/prisma";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";

const router = Router();

function isOptionalRating(value: unknown): boolean
{
    return value === undefined ||
        (
            Number.isInteger(value) &&
            (value as number) >= 1 &&
            (value as number) <= 5
        );
}

function isOptionalBoolean(value: unknown): boolean
{
    return value === undefined ||
        typeof value === 'boolean';
}

router.post('/', requireAuth, async (req:AuthenticatedRequest, res) => {
    try
    {
        const {
            googlePlaceId,
            cafeName,
            cafeAddress,
            cafeLatitude,
            cafeLongitude,

            rating,
            comment,
            coffeeRating,
            foodRating,
            serviceRating,
            comfortRating,
            quietRating,
            goodForWork,
            goodForStudy,
            goodForDate,
        } = req.body;

        if (
            typeof googlePlaceId !== 'string' ||
            googlePlaceId.trim() === '' ||
            typeof cafeName !== 'string' ||
            cafeName.trim() === '' ||
            typeof cafeAddress !== 'string' ||
            cafeAddress.trim() === '' ||
            typeof cafeLatitude !== 'number' ||
            !Number.isFinite(cafeLatitude) ||
            typeof cafeLongitude !== 'number' ||
            !Number.isFinite(cafeLongitude) ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5 ||
            typeof comment !== 'string' ||
            comment.trim() === '' ||
            !isOptionalRating(coffeeRating) ||
            !isOptionalRating(foodRating) ||
            !isOptionalRating(serviceRating) ||
            !isOptionalRating(comfortRating) ||
            !isOptionalRating(quietRating) ||
            !isOptionalBoolean(goodForWork) ||
            !isOptionalBoolean(goodForStudy) ||
            !isOptionalBoolean(goodForDate)
        )
        {
            return res.status(400).json({
                error: 'Datos de reseña inválidos',
            });
        }

        const userId = req.userId;
        
        if (!userId)
        {
            return res.status(401).json({
                error: 'Autenticación requerida',
            });
        }

        const cafe = await prisma.cafe.upsert({
            where: {
                googlePlaceId:
                    googlePlaceId.trim(),
            },

            update: {
                name:
                    cafeName.trim(),

                address:
                    cafeAddress.trim(),

                latitude:
                    cafeLatitude,

                longitude:
                    cafeLongitude,
            },

            create: {
                googlePlaceId:
                    googlePlaceId.trim(),

                name:
                    cafeName.trim(),

                address:
                    cafeAddress.trim(),

                latitude:
                    cafeLatitude,

                longitude:
                    cafeLongitude,
            },
        });

        const review = await prisma.review.create({
            data: {
                userId,
                cafeId: cafe.id,
                rating,
                comment: comment.trim(),
                coffeeRating,
                foodRating,
                serviceRating,
                comfortRating,
                quietRating,
                goodForWork,
                goodForStudy,
                goodForDate,
            },
        });

        return res.status(201).json(review);
    }
    catch(error)
    {
        console.error(error);

        return res.status(500).json({
            error: 'No se pudo crear la reseña',
        });
    }
});

export default router;