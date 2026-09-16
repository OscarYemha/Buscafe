import express from 'express';
import prisma from './lib/prisma.js';
import { Prisma } from './generated/prisma/client.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API de BusCafé funcionando correctamente',
    });
});

app.get('/cafes', async (req, res) => {
    try {
        const cafes = await prisma.cafe.findMany();

        res.json(cafes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'No se pudieron obtener las cafeterías',
        });
    }
});

app.post('/cafes', async (req, res) => {
    try {
        const {
            googlePlaceId,
            name,
            address,
            latitude,
            longitude,
        } = req.body;

        if (typeof googlePlaceId !== 'string' ||
            googlePlaceId.trim() === '' ||
            typeof name !== 'string' ||
            name.trim() === '' ||
            typeof address !== 'string' ||
            address.trim() === '' ||
            typeof latitude !== 'number' ||
            typeof longitude !== 'number'
        )
        {
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

        res.status(201).json(cafe);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        )
        {
            return res.status(409).json({
                error: 'La cafetería ya existe',
            });
        }
        
        console.error(error);

        res.status(500).json({
            error: 'No se pudo crear la cafetería',
        });
    }
});

export default app;
