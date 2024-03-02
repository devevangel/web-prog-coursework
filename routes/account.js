import express from "express";
import { listAccounts } from "../controllers/account.js";

const accountRouter = express.Router();

accountRouter.route("/").get(listAccounts);

export default accountRouter;
