# BusCafé

Aplicación móvil Full Stack para descubrir cafeterías según la ubicación, las preferencias y el motivo de la visita.

BusCafé permite buscar cafeterías cercanas, consultar sus detalles y evaluar qué lugares resultan más adecuados para trabajar, estudiar, tener una cita, comer o disfrutar de un buen café.

> Proyecto en desarrollo.

## Funcionalidades implementadas

- Búsqueda de cafeterías por nombre o ubicación.
- Obtención de cafeterías cercanas mediante geolocalización.
- Integración con Google Places para obtener información de los establecimientos.
- Cálculo de distancia entre el usuario y cada cafetería.
- Navegación entre inicio, resultados y detalle.
- Filtros según el motivo de la visita:
  - Trabajar.
  - Estudiar.
  - Tener una cita.
  - Tomar café.
  - Comer.
  - Encontrar lugares pet friendly.
- Registro de usuarios con contraseñas cifradas.
- Publicación de reseñas y calificaciones.
- Evaluaciones específicas de café, comida, atención, comodidad y nivel de ruido.
- Cálculo de estadísticas y recomendaciones a partir de las reseñas.

## Tecnologías

### Aplicación móvil

- TypeScript
- React Native
- Expo
- React Navigation
- Expo Location

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Google Places API
- bcrypt

## Estructura del proyecto

```text
buscafe-mobile/
├── mobile/    Aplicación móvil desarrollada con Expo y React Native
├── server/    API REST desarrollada con Node.js y Express
└── README.md
```

## Requisitos

Para ejecutar el proyecto se necesita:

- Node.js 20.19.4 o superior.
- npm.
- PostgreSQL.
- Una clave habilitada para Google Places API.
- Expo Go o un emulador de Android/iOS.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/OscarYemha/buscafe-mobile.git
cd buscafe-mobile
```

### 2. Configurar el servidor

```bash
cd server
npm install
```

Crear el archivo de configuración local a partir del ejemplo:

```bash
cp .env.example .env
```

Luego completar `server/.env` con la conexión a PostgreSQL y la clave de Google Places:

```env
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@localhost:5432/buscafe
GOOGLE_PLACES_API_KEY=TU_CLAVE_DE_GOOGLE_PLACES
```

Generar el cliente de Prisma y ejecutar las migraciones:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate dev --config prisma7.config.ts
```

Iniciar el servidor:

```bash
npm run dev
```

La API se ejecuta en el puerto `3001`.

### 3. Configurar la aplicación móvil

En otra terminal:

```bash
cd mobile
npm install
```

Crear el archivo de configuración local:

```bash
cp .env.example .env
```

Luego indicar en `mobile/.env` la dirección del servidor:

```env
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3001
```

El teléfono y la computadora deben estar conectados a la misma red local.

Iniciar Expo:

```bash
npm start
```

Luego se puede abrir la aplicación con Expo Go o mediante un emulador.

## API

La API REST incluye rutas para:

- Buscar cafeterías.
- Obtener cafeterías cercanas.
- Consultar los detalles de un establecimiento.
- Registrar usuarios.
- Crear reseñas.
- Calcular calificaciones y recomendaciones.

## Estado actual

BusCafé se encuentra en desarrollo. Actualmente cuenta con navegación móvil, geolocalización, búsqueda de cafeterías, integración con Google Places, registro de usuarios, reseñas y persistencia de datos en PostgreSQL.

## Próximos pasos

- Completar el inicio de sesión y la gestión de sesiones.
- Añadir pruebas automatizadas.
- Mejorar el manejo de errores y los estados de carga.
- Preparar el despliegue del backend y la base de datos.
- Publicar una primera versión de prueba para Android.

## Autor

**Oscar Ismael Yemha**

- GitHub: [OscarYemha](https://github.com/OscarYemha)
- LinkedIn: [oscarismaelyemha](https://www.linkedin.com/in/oscarismaelyemha/)