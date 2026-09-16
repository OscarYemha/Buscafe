import { Router } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const cafes = await prisma.cafe.findMany();

        return res.json(cafes);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'No se pudieron obtener las cafeterías',
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: 'El ID de la cafetería es inválido',
            });
        }

        const cafe = await prisma.cafe.findUnique({
            where: {
                id,
            },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
            },
        });

        if (!cafe) {
            return res.status(404).json({
                error: 'Cafetería no encontrada',
            });
        }

        return res.json(cafe);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'No se pudo obtener la cafetería',
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            googlePlaceId,
            name,
            address,
            latitude,
            longitude,
        } = req.body;

        if (
            typeof googlePlaceId !== 'string' ||
            googlePlaceId.trim() === '' ||
            typeof name !== 'string' ||
            name.trim() === '' ||
            typeof address !== 'string' ||
            address.trim() === '' ||
            typeof latitude !== 'number' ||
            typeof longitude !== 'number'
        ) {
            return res.status(400).json({
                error: 'Los datos de la cafetería son inválidos',
            });
        }

        const cafe = await prisma.cafe.create({
            data: {
                googlePlaceId,
                name,
                address,
                latitude,
                longitude,
            },
        });

        return res.status(201).json(cafe);
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return res.status(409).json({
                error: 'La cafetería ya existe',
            });
        }

        console.error(error);

        return res.status(500).json({
            error: 'No se pudo crear la cafetería',
        });
    }
});

export default router;
