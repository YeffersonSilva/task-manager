// index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./db/connect.ts";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./helpers/errorhandler.ts";

// Configurar las variables de entorno
dotenv.config();

// Puerto de la aplicación
const port = process.env.PORT || 8000;

// Inicializar express
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Error handler middleware
app.use(errorHandler);

// Obtener la ruta del archivo actual usando import.meta.url
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Cargar dinámicamente los archivos de rutas desde la carpeta 'routes'
const routeFiles = fs.readdirSync(path.resolve(__dirname, './routes')).filter(file => file.endsWith(".ts"));

routeFiles.forEach((file) => {
  // Importar dinámicamente cada archivo de ruta
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
});

// Exportar `app` para las pruebas
export { app };

// Iniciar el servidor
const server = async () => {
  try {
    // Conectar a la base de datos
    await connect();

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

server();
