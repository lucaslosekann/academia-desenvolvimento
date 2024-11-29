import ps from "prompt-sync";
const prompt = ps();

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
        ui();
    });
});

import axios from "axios";
const instance = axios.create({
    baseURL: "http://localhost:8000",
});

async function ui() {
    while (true) {
        const res = await printUI();
        if (res === "exit") {
            break;
        }
    }
    process.exit(0);
}

async function printUI() {
    console.log(`
        1 - Aluno
        2 - Pagamento
        3 - Treino
        4 - Parar interface
        `);
    const option = prompt("Escolha uma opção: ");
    if (option === "4") {
        return "exit";
    }

    switch (option) {
        case "1": {
            console.log(`
                1 - Listar Alunos
                2 - Criar Aluno
                3 - Atualizar Aluno
                4 - Deletar Aluno
                5 - Buscar Aluno por ID`);
            const optionAluno = prompt("Escolha uma opção: ");
            switch (optionAluno) {
                case "1":
                    const alunos = await instance.get("/aluno");
                    console.log(alunos.data);
                    break;
                case "2":
                    {
                        const nome = prompt("Nome: ");
                        const email = prompt("Email: ");
                        const plano_pag = prompt("Plano de pagamento: ");
                        const rua = prompt("Rua: ");
                        const cep = prompt("CEP: ");
                        const bairro = prompt("Bairro: ");
                        const numero = prompt("Número: ");
                        const telefones: { telefone: string; ddd: string }[] = [];
                        while (true) {
                            const telefone = prompt("Telefone: ");
                            const ddd = prompt("DDD: ");
                            telefones.push({ telefone, ddd });
                            const resp = prompt("Deseja adicionar outro telefone? (s/n) ");
                            if (resp === "n") {
                                break;
                            }
                        }
                        await instance
                            .post("/aluno", {
                                nome,
                                email,
                                plano_pag,
                                endereco: {
                                    rua,
                                    cep,
                                    bairro,
                                    numero: Number(numero),
                                },
                                telefones,
                            })
                            .then((r) => console.log(r.data))
                            .catch((e) => console.log(e.response.data.message ?? e.response.data?.errors[0].message));
                    }
                    break;
                case "3": {
                    const id = prompt("ID do aluno: ");
                    const nome = prompt("Nome: ");
                    const email = prompt("Email: ");
                    const plano_pag = prompt("Plano de pagamento: ");

                    await instance
                        .put(`/aluno/${id}`, {
                            nome,
                            email,
                            plano_pag,
                        })
                        .then((r) => console.log(r.data))
                        .catch((e) => console.log(e.response.data.message ?? e.response.data?.errors[0].message));
                    break;
                }

                case "4": {
                    const id = prompt("ID do aluno: ");
                    await instance
                        .delete(`/aluno/${id}`)
                        .then((r) => console.log(r.data))

                        .catch((e) => console.log(e.response.data.message ?? e.response.data?.errors[0].message));
                    break;
                }
                case "5": {
                    const id = prompt("ID do aluno: ");
                    await instance
                        .get(`/aluno/${id}`)
                        .then((r) => console.log(r.data))

                        .catch((e) => console.log(e.response.data.message ?? e.response.data?.errors[0].message));
                    break;
                }
            }
        }
        case "2": {
            console.log(`
                1 - Listar Pagamentos
                2 - Criar Pagamento
                3 - Atualizar Pagamento
                4 - Deletar Pagamento
                `);
            const optionPagamento = prompt("Escolha uma opção: ");
            switch (optionPagamento) {
                case "1":
                    const pagamentos = await instance.get("/pagamento");
                    console.log(pagamentos.data);
                    break;
                case "2":
                    {
                        const aluno_id = prompt("ID do aluno: ");
                        const valor = prompt("Valor: ");
                        const data = prompt("Data do pagamento: ");
                        const status = prompt("Status: ");
                        await instance
                            .post("/pagamento", {
                                aluno_id: Number(aluno_id),
                                valor: Number(valor),
                                data,
                                status,
                            })
                            .then((r) => console.log(r.data))
                            .catch((e) => console.log(e?.response?.data?.message ?? e?.response?.data?.errors?.[0].message));
                    }
                    break;
                case "3": {
                    const id = prompt("ID do pagamento: ");
                    const status = prompt("Status: ");
                    await instance
                        .put(`/pagamento/${id}`, {
                            status,
                        })
                        .then((r) => console.log(r.data))
                        .catch((e) => console.log(e?.response?.data?.message ?? e?.response?.data?.errors[0].message));
                    break;
                }

                case "4": {
                    const id = prompt("ID do pagamento: ");
                    await instance
                        .delete(`/pagamento/${id}`)
                        .then((r) => console.log(r.data))
                        .catch((e) => console.log(e.response.data.message ?? e.response.data?.errors[0].message));
                    break;
                }
            }
        }

        case "3": {
            console.log(`
                1 - Listar Treinos
                2 - Criar Treino
                3 - Atualizar Treino
                4 - Deletar Treino
                `);
            const optionTreino = prompt("Escolha uma opção: ");
            switch (optionTreino) {
                case "1":
                    const treinos = await instance.get("/treino");
                    console.log(treinos.data);
                    break;
                case "2":
                    {
                        const aluno_id = prompt("ID do aluno: ");
                        const descricao = prompt("Descrição: ");
                        const frequencia = prompt("Frequência: ");
                        await instance
                            .post("/treino", {
                                aluno_id: Number(aluno_id),
                                descricao,
                                frequencia: Number(frequencia),
                            })
                            .then((r) => console.log(r.data))
                            .catch((e) => console.log(e?.response?.data?.message ?? e?.response?.data?.errors[0].message));
                    }
                    break;
                case "3": {
                    const id = prompt("ID do treino: ");
                    const descricao = prompt("Descrição: ");
                    const frequencia = prompt("Frequência: ");
                    const aluno_id = prompt("ID do aluno: ");
                    await instance
                        .put(`/treino/${id}`, {
                            aluno_id: Number(aluno_id),
                            descricao,
                            frequencia: Number(frequencia),
                        })
                        .then((r) => console.log(r.data))
                        .catch((e) => console.log(e.response.data.message ?? e.response.data?.errors[0].message));
                    break;
                }

                case "4": {
                    const id = prompt("ID do treino: ");
                    await instance
                        .delete(`/treino/${id}`)
                        .then((r) => console.log(r.data))
                        .catch((e) => console.log(e?.response?.data?.message ?? e?.response?.data?.errors[0].message));
                    break;
                }
            }
        }
    }
}
