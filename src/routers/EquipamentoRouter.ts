import { Router } from "express";
import EquipamentoController from "../controllers/EquipamentoController";

const EquipamentoRouter = Router();

EquipamentoRouter.get("/", EquipamentoController.index);
EquipamentoRouter.post("/", EquipamentoController.create);
EquipamentoRouter.put("/:id", EquipamentoController.update);
EquipamentoRouter.delete("/:id", EquipamentoController.delete);
EquipamentoRouter.get("/:id", EquipamentoController.show);

export default EquipamentoRouter;
