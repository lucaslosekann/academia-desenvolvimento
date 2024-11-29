import { Request, Response } from "express";
import Database from "../database";
import { CreatePagamentoSchema, UpdatePagamentoSchema, DeletePagamentoSchema } from "../schemas/PagamentoSchema";

export default class PagamentoController {
    public static async index(req: Request, res: Response) {
        const pagamentos = await Database.Pagamento.findAll();
        res.json(
            pagamentos.map((p) => ({
                id: p.id,
                aluno: {
                    id: p.aluno_id,
                    nome: p.nome,
                    email: p.email,
                    plano_pag: p.plano_pag,
                },
                data: p.data,
                valor: p.valor,
                status: p.status,
            }))
        );
    }

    public static async show(req: Request, res: Response) {
        const { data, error } = await DeletePagamentoSchema.safeParseAsync({
            id: req.params.id,
        });
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const pagamento = await Database.Pagamento.findById(data.id);

        if (!pagamento) {
            return res.status(404).json({ message: "Pagamento não encontrado!" });
        }

        res.json({
            id: pagamento.id,
            aluno: {
                id: pagamento.aluno_id,
                nome: pagamento.nome,
                email: pagamento.email,
                plano_pag: pagamento.plano_pag,
            },
            data: pagamento.data,
            valor: pagamento.valor,
            status: pagamento.status,
        });
    }

    public static async create(req: Request, res: Response) {
        const { data, error } = await CreatePagamentoSchema.safeParseAsync(req.body);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const pagamento = await Database.Pagamento.create(data);

        res.status(201).json({ pagamento, message: "Pagamento criado com sucesso!" });
    }

    public static async update(req: Request, res: Response) {
        const { data, error } = await UpdatePagamentoSchema.safeParseAsync({
            ...req.body,
            id: req.params.id,
        });
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const pagamento = await Database.Pagamento.update(data);

        if (pagamento.affectedRows === 0) {
            return res.status(404).json({ message: "Pagamento não encontrado!" });
        }

        res.status(200).json({ pagamento, message: "Pagamento atualizado com sucesso!" });
    }

    public static async delete(req: Request, res: Response) {
        const { data, error } = await DeletePagamentoSchema.safeParseAsync({
            id: req.params.id,
        });
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const pagamento = await Database.Pagamento.delete(data.id);

        if (pagamento.affectedRows === 0) {
            return res.status(404).json({ message: "Pagamento não encontrado!" });
        }

        res.status(200).json({ pagamento, message: "Pagamento deletado com sucesso!" });
    }
}
