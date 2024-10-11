import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./db/connect.ts";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./helpers/errorhandler.ts";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swaggerConfig.ts';

// Load environment variables from a .env file into process.env

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

// Configure CORS to allow requests from the specified client URL with credentials

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(errorHandler);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routeFiles = fs.readdirSync(path.resolve(__dirname, './routes')).filter(file => file.endsWith(".ts"));

// Import and register each route with the "/api/v1" path prefix

routeFiles.forEach((file) => {
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { app };

const server = async () => {
  try {
    await connect();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    process.exit(1);
  }
};


server();
