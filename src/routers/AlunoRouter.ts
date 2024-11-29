import { Router } from "express";
import AlunoController from "../controllers/AlunoController";

const AlunoRouter = Router();

AlunoRouter.get("/", AlunoController.index);
AlunoRouter.post("/", AlunoController.create);
AlunoRouter.put("/:id", AlunoController.update);
AlunoRouter.delete("/:id", AlunoController.delete);
AlunoRouter.get("/:id", AlunoController.show);

export default AlunoRouter;
