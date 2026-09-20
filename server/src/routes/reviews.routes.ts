import { Router } from "express";
import prisma from "../lib/prisma";

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

router.post('/', async (req, res) => {
    try
    {
        const {
            userId,
            cafeId,
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
            !Number.isInteger(userId) ||
            userId <= 0 ||
            !Number.isInteger(cafeId) ||
            cafeId <= 0 ||
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
                error: 'Los datos de la reseña son inválidos',
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user)
        {
            return res.status(404).json({
                error: 'Usuario no encontrado',
            });
        }

        const cafe = await prisma.cafe.findUnique({
            where: {
                id: cafeId,
            },
        });

        if (!cafe)
        {
            return res.status(404).json({
                error: 'Cafetería no encontrada',
            });
        }

        const review = await prisma.review.create({
            data: {
                userId,
                cafeId,
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