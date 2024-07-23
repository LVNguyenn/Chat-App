import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const PORT = process.env.PORT || 5000;

dotenv.config();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser()); //

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

const swagger_path = path.resolve(process.cwd(), "swagger.yaml");
const swaggerDocument = YAML.load(swagger_path);

app.get("/", (req, res) => {
  res.send("<h1>Chat App</h1><a href='/api-docs'>Documentation</a>");
});

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
  })
);

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
