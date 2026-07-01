import express from "express";
import cors from "cors";

import propertiesRouter from "./routes/properties.js";
import agentsRouter from "./routes/agents.js";

// Builds the Express app without connecting to a database or listening on a
// port — so tests can import it and drive it with supertest, and index.js can
// wire up the DB + listener around it.
export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check — used by Docker/orchestrators to verify the service is up.
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/properties", propertiesRouter);
  app.use("/api/agents", agentsRouter);

  // 404 for unknown API routes
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
  });

  // Centralized error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  });

  return app;
};
