import express from "express";
import { listCategories } from "../controllers/category.js";

const categoryRouter = express.Router();

categoryRouter.route("/").get(listCategories);

export default categoryRouter;
