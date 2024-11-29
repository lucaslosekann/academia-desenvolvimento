import dotenv from "dotenv";
dotenv.config();
import { EnvSchema } from "./schemas/EnvSchema";
export const ENV = EnvSchema.parse(process.env);

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "express-async-errors";
import { createTables } from "./database";
import AlunoRouter from "./routers/AlunoRouter";
import EquipamentoRouter from "./routers/EquipamentoRouter";
import TreinoRouter from "./routers/TreinoRouter";
import PagamentoRouter from "./routers/PagamentoRouter";
import ExercicioRouter from "./routers/ExercicioRouter";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/aluno", AlunoRouter);
app.use("/equipamento", EquipamentoRouter);
app.use("/treino", TreinoRouter);
app.use("/pagamento", PagamentoRouter);
app.use("/exercicio", ExercicioRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});

createTables().then(() => {
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
});
