import { Request, Response } from "express";
import Database from "../database";
import { CreateAlunoSchema, DeleteAlunoSchema, ShowAlunoSchema, UpdateAlunoSchema } from "../schemas/AlunoSchema";

export default class AlunoController {
    public static async index(req: Request, res: Response) {
        const alunos = await Database.Aluno.findAll();
        res.json(alunos);
    }

    public static async create(req: Request, res: Response) {
        const { data, error } = await CreateAlunoSchema.safeParseAsync(req.body);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const alunoResult = await Database.Aluno.create(
            {
                email: data.email,
                nome: data.nome,
                plano_pag: data.plano_pag,
            },
            data.telefones,
            data.endereco
        );

        res.status(201).json({ message: "Aluno criado com sucesso", id: alunoResult.insertId });
    }

    public static async update(req: Request, res: Response) {
        const { data, error } = await UpdateAlunoSchema.safeParseAsync({ ...req.body, id: req.params.id });
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        await Database.Aluno.update(data);
        res.json({ message: "Aluno atualizado com sucesso" });
    }

    public static async delete(req: Request, res: Response) {
        const { data, error } = await DeleteAlunoSchema.safeParseAsync(req.params);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        await Database.Aluno.delete(data.id);
        res.json({ message: "Aluno deletado com sucesso" });
    }

    public static async show(req: Request, res: Response) {
        const { data, error } = await ShowAlunoSchema.safeParseAsync(req.params);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const aluno = await Database.Aluno.findById(data.id);
        if (!aluno) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        const telefones = await Database.Telefone.findByAlunoId(data.id);
        const treinos = await Database.Treino.findByAlunoId(data.id).then((treinos) =>
            Promise.all(
                treinos.map(async (treino) => {
                    const exercicios = await Database.Exercicio.findByTreinoId(treino.id);
                    return { ...treino, exercicios };
                })
            )
        );
        const pagamentos = await Database.Pagamento.findByAlunoId(data.id);

        res.json({
            id: aluno.id,
            email: aluno.email,
            nome: aluno.nome,
            plano_pag: aluno.plano_pag,
            endereco: {
                id: aluno.endereco_id,
                rua: aluno.rua,
                numero: aluno.numero,
                bairro: aluno.bairro,
                cep: aluno.cep,
            },
            telefones,
            treinos,
            pagamentos,
        });
    }
}
