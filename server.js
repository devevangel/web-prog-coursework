import dotenv from "dotenv";
import express from "express";
dotenv.config();

// Routes
import accountRouter from "./routes/account.js";

const app = express();
app.use(express.static("client", { extensions: ["html"] }));
app.use(express.json());

// Mounted routes
app.use("/accounts", accountRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(`listening on port ${port}`));
