import { Router } from "express";
import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import bcrypt from 'bcrypt';

const router = Router();

router.get('/', async (req, res) => {
    try
    {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return res.json(users);
    }
    catch (error)
    {
        console.error(error);

        return res.status(500).json({
            error: 'No se pudieron obtener los usuarios',
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        if (
            typeof name !== 'string' ||
            name.trim() === '' ||
            typeof email !== 'string' ||
            email.trim() === '' ||
            typeof password !== 'string' ||
            password.length < 8
        ) {
            return res.status(400).json({
                error: 'Los datos del usuario son inválidos',
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                passwordHash,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return res.status(201).json(user);
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return res.status(409).json({
                error: 'Ya existe un usuario con ese email',
            });
        }

        console.error(error);

        return res.status(500).json({
            error: 'No se pudo crear el usuario',
        });
    }
});

export default router;