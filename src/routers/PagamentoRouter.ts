import { Router } from "express";
import PagamentoController from "../controllers/PagamentoController";

const PagamentoRouter = Router();

PagamentoRouter.get("/", PagamentoController.index);
PagamentoRouter.post("/", PagamentoController.create);
PagamentoRouter.put("/:id", PagamentoController.update);
PagamentoRouter.delete("/:id", PagamentoController.delete);
PagamentoRouter.get("/:id", PagamentoController.show);

export default PagamentoRouter;
