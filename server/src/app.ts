import express from 'express';
import cafesRouter from './routes/cafes.routes.js';
import usersRouter from './routes/users.routes.js';
import reviewsRouter from './routes/reviews.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API de BusCafé funcionando correctamente',
    });
});

app.use('/cafes', cafesRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);

export default app;