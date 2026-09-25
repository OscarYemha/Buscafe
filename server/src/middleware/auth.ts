import {
    NextFunction,
    Request,
    Response,
} from 'express';

import jwt from 'jsonwebtoken';

export type AuthenticatedRequest =
    Request & {
        userId?: number;
    };

type JwtPayload = {
    userId: number;
};

export function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
)
{
    const authorization =
        req.headers.authorization;

    if (
        !authorization ||
        !authorization.startsWith('Bearer ')
    )
    {
        return res.status(401).json({
            error: 'Autenticación requerida',
        });
    }

    const token =
        authorization.substring(
            'Bearer '.length
        );

    const jwtSecret =
        process.env.JWT_SECRET;

    if (!jwtSecret)
    {
        throw new Error(
            'JWT_SECRET no está configurado'
        );
    }

    try
    {
        const payload =
            jwt.verify(
                token,
                jwtSecret
            ) as JwtPayload;

        if (
            !Number.isInteger(payload.userId) ||
            payload.userId <= 0
        )
        {
            return res.status(401).json({
                error: 'Token inválido',
            });
        }

        req.userId =
            payload.userId;

        next();
    }
    catch
    {
        return res.status(401).json({
            error: 'Token inválido o vencido',
        });
    }
}