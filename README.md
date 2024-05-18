Aquí tienes un `README.md` generado para tu proyecto:

```markdown
# DisruptiveStudio Test

## Descripción

Este es un proyecto de prueba para DisruptiveStudio utilizando Node.js, Express y TypeScript. El proyecto incluye autenticación, manejo de roles, subida de archivos, validación de datos y documentación de la API con Swagger.

Se ha utilizado para este proyecto las siguientes herramientas relevantes: Node.js, express.js, typscript, jest.js, Cloudinary (para guardar pdf e imagenes), nodemon, JWT, bcrypt, express-fileupload, express-validator, entre otras.

## Estructura del Proyecto

El proyecto tiene la siguiente estructura de directorios:

```
disruptivestudio_test/
├── logs/
├── mongo_data/
├── node_modules/
├── src/
│   ├── __tests__/
│   ├── database/
│   │   └── config.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   └── authRoutes.ts
│   │   ├── role/
│   │   │   └── roleRoutes.ts
│   │   ├── seeds/   ===================================== aqui en el seed puedes crear rapidamente roles y usuarios con su data necesaria para no crear uno por uno
│   │   │   └── seedRoutes.ts
│   │   ├── user/
│   │   │   └── userRoutes.ts
│   │   ├── category/
│   │   │   └── categoryRoutes.ts
│   │   ├── topic/
│   │   │   └── topicRoutes.ts
│   ├── shared/
│   │   ├── config/
│   │   │   └── config.ts
│   │   ├── middlewares/
│   │   │   └── general.ts
│   │   └── logger.ts
│   ├── app.ts
│   ├── server.ts
├── .env
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── jest.config.ts
├── package.json
└── tsconfig.json
```

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/clma-luis/DisruptiveStudio_test.git
   ```

2. Navegar al directorio del proyecto:

   ```bash
   cd disruptivestudio_test
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```
   Es importante decir que la version de node usada es v20.11.1

4. Crear un archivo `.env` en el directorio raíz del proyecto y configurar las variables de entorno necesarias.

## Scripts Disponibles

En el archivo `package.json`, se encuentran los siguientes scripts:

- `npm start`: Compila el proyecto TypeScript y ejecuta el archivo compilado `dist/app.js`.
- `npm run dev`: Ejecuta la aplicación en modo desarrollo utilizando `ts-node` y `nodemon`.
- `npm run build`: Compila el proyecto TypeScript.
- `npm test`: Ejecuta las pruebas utilizando `jest`.

## Uso

Levantar la base de datos con docker

```bash
docker compose up -d
```

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para compilar y ejecutar el servidor en modo producción:

```bash
npm start
```

ES IMPORTANTE DESTACAR QUE EN EL .ENV.TEMPLATE ESTAN LAS URL NECESARIAS PARA PODER LEVANTAR EL PROYECTO

## Logging

Este proyecto utiliza `winston` para el logging y `morgan` para registrar solicitudes HTTP. Los logs se guardan en el directorio `logs/`.

## Documentación de la API

La documentación de la API se genera automáticamente con Swagger. Puedes acceder a la documentación en:

```
http://localhost:<puerto>/api-docs
```

## Middleware

El proyecto incluye varios middlewares para validar datos, manejar permisos, subir archivos y más. Los middlewares se encuentran en `src/shared/middlewares`.

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para discutir los cambios que te gustaría hacer.

## Licencia

Este proyecto está bajo la Licencia ISC.

```