import { Router } from "express";
import TreinoController from "../controllers/TreinoController";

const TreinoRouter = Router();

TreinoRouter.get("/", TreinoController.index);
TreinoRouter.post("/", TreinoController.create);
TreinoRouter.put("/:id", TreinoController.update);
TreinoRouter.delete("/:id", TreinoController.delete);
TreinoRouter.get("/:id", TreinoController.show);

export default TreinoRouter;
