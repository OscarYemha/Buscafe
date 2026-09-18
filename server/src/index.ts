import app from './app.js';
import 'dotenv/config';

const PORT = 3001;


app.listen(PORT, () => {
    console.log(`Servidor de BusCafé ejecutándose en el puerto ${PORT}`);
})