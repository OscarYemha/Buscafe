import app from './app.js';

const PORT = 3001;


app.listen(PORT, () => {
    console.log(`Servidor de BusCafé ejecutándose en el puerto ${PORT}`);
})