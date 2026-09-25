import { Router } from "express";
import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get(
    '/me',
    requireAuth,
    async (
        req: AuthenticatedRequest,
        res
    ) => {
        try
        {
            const userId = req.userId;

            if (!userId)
            {
                return res.status(401).json({
                    error: 'Autenticación requerida',
                });
            }

            const user = 
                await prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });

            if (!user)
            {
                return res.status(401).json({
                    error: 'Usuario no encontrado',
                });
            }

            return res.json(user);
        }
        catch (error)
        {
            console.error(error);

            return res.status(500).json({
                error: 'No se pudo obtener el usuario',
            });
        }
    }
)

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

const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

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
            !isValidEmail(email.trim()) ||
            typeof password !== 'string' ||
            password.trim().length < 8
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

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret)
        {
            throw new Error('JWT_SECRET no está configurado');
        }

        const token =
            jwt.sign(
                {
                    userId: user.id,
                },
                jwtSecret,
                {
                    expiresIn: '7d',
                }
            )

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
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

router.post('/login', async (req, res) => {
    try
    {
        const {
            email,
            password
        } = req.body;

        if (
            typeof email !== 'string' ||
            email.trim() === '' ||
            typeof password !== 'string' ||
            password === ''
        )
        {
            return res.status(400).json({
                error: 'Email y contraseña son obligatorios',
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email.trim().toLowerCase(),
            },
        });

        if (!user)
        {
            return res.status(401).json({
                error: 'Email o contraseña incorrectos',
            });
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordIsValid)
        {
            return res.status(401).json({
                error: 'Email o contraseña incorrectos',
            });
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret)
        {
            throw new Error('JWT_SECRET no está configurado');
        }

        const token = 
            jwt.sign(
                {
                    userId: user.id,
                },
                jwtSecret,
                {
                    expiresIn: '7d',
                }
            );

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error)
    {
        console.error(error);

        return res.status(500).json({
            error: 'No se pudo iniciar sesión',
        });
    }
});

export default router;