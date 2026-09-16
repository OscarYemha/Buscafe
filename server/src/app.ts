import express from 'express';
import cafesRouter from './routes/cafes.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API de BusCafé funcionando correctamente',
    });
});

app.use('/cafes', cafesRouter);

export default app;