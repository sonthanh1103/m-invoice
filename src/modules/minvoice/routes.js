import express from "express";
import { Controller } from "./controller.js";

const router = express.Router();
const controller = new Controller();

router.post("/issue", controller.issueInvoice);
router.post("/cancel", controller.cancelInvoice);

export default router;
