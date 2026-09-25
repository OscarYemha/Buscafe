import { Router } from "express";
import prisma from "../lib/prisma";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";

const router = Router();

router.get(
    '/',
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
        try 
        {
            const userId = req.userId;

            if (!userId)
            {
                return res.status(401).json({
                    error: 'Autenticación requerida',
                });
            }

            const favorites = await prisma.favorite.findMany({
                where: {
                    userId,
                },
                include: {
                    cafe: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return res.json(
                favorites.map(favorite => ({
                    id: favorite.id,
                    createdAt: favorite.createdAt,
                    cafe: favorite.cafe,
                }))
            );
        }
        catch (error)
        {
            console.error(error);

            return res.status(500).json({
                error: 'No se pudieron obtener los favoritos',
            });
        }
    }
);

router.post(
    '/',
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
        try
        {
            const {
                googlePlaceId,
                cafeName,
                cafeAddress,
                cafeLatitude,
                cafeLongitude,
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
                !Number.isFinite(cafeLongitude)
            )
            {
                return res.status(400).json({
                    error: 'Datos de cafetería inválidos',
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
                    googlePlaceId: googlePlaceId.trim(),
                },
                update: {
                    name: cafeName.trim(),
                    address: cafeAddress.trim(),
                    latitude: cafeLatitude,
                    longitude: cafeLongitude,
                },
                create: {
                    googlePlaceId: googlePlaceId.trim(),
                    name: cafeName.trim(),
                    address: cafeAddress.trim(),
                    latitude: cafeLatitude,
                    longitude: cafeLongitude,
                },
            });

            const favorite = await prisma.favorite.upsert({
                where: {
                    userId_cafeId: {
                        userId,
                        cafeId: cafe.id,
                    },
                },
                update: {},
                create: {
                    userId,
                    cafeId: cafe.id,
                },
                include: {
                    cafe: true,
                },
            });

            return res.status(201).json(favorite);
        }
        catch (error)
        {
            console.error(error);

            return res.status(500).json({
                error: 'No se pudo agregar el favorito',
            });
        }
    }
);

router.delete(
    '/:googlePlaceId',
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
        try
        {
            const userId = req.userId;

            if (!userId)
            {
                return res.status(401).json({
                    error: 'Autenticación requerida',
                });
            }

            const googlePlaceIdParam = req.params.googlePlaceId;

            if (
                typeof googlePlaceIdParam !== 'string' ||
                googlePlaceIdParam.trim() === ''
            )
            {
                return res.status(400).json({
                    error: 'Identificador de cafetería inválido',
                });
            }

            const googlePlaceId = googlePlaceIdParam.trim();

            const cafe = await prisma.cafe.findUnique({
                where: {
                    googlePlaceId,
                },
            });

            if (!cafe)
            {
                return res.status(404).json({
                    error: 'Cafetería no encontrada',
                });
            }

            await prisma.favorite.deleteMany({
                where: {
                    userId,
                    cafeId: cafe.id,
                },
            });

            return res.status(204).send();
        }
        catch (error)
        {
            console.error(error);

            return res.status(500).json({
                error: 'No se pudo quitar el favorito',
            });
        }
    }
);

export default router;