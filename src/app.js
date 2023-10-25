import express from "express";
import morgan from "morgan";
// Routes
import serviceRoutes from "./routes/service.routes.js";

const app = express();

app.use(express.static('public'));

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/services", serviceRoutes);

export default app;
