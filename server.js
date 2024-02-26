import dotenv from "dotenv";
import express from "express";

// Routes
import categoryRouter from "./routes/category.js";

dotenv.config();

const app = express();

app.use(express.static("client", { extensions: ["html"] }));
app.use(express.json());

// Mounted routes
app.use("/categories", categoryRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(`listening on port ${port}`));
