import express from "express";
import { router as minvoiceRouter } from "../src/modules/minvoice/index.js";

const app = express();
const port = 3006;
app.use(express.json());

app.use("/api/minvoice", minvoiceRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
