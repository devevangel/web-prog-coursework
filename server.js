import dotenv from "dotenv";
import express from "express";
import sqlite3 from "sqlite3";

dotenv.config();

const app = express();

app.use(express.static("client"));
app.use(express.json());

const port = process.env.PORT;
app.listen(port, () => console.log(`listening on port ${port}`));
