import { Router } from "express";
import ExercicioController from "../controllers/ExercicioController";

const ExercicioRouter = Router();

ExercicioRouter.get("/", ExercicioController.index);
ExercicioRouter.post("/", ExercicioController.create);
ExercicioRouter.put("/:id", ExercicioController.update);
ExercicioRouter.delete("/:id", ExercicioController.delete);
ExercicioRouter.get("/:id", ExercicioController.show);

export default ExercicioRouter;
