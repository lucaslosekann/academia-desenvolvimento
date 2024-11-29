import { Request, Response } from "express";
import Database from "../database";
import { CreateTreinoSchema, DeleteTreinoSchema, ShowTreinoSchema, UpdateTreinoSchema } from "../schemas/TreinoSchema";

export default class TreinoController {
    public static async index(req: Request, res: Response) {
        const treinos = await Database.Treino.findAll();
        res.json(treinos);
    }

    public static async create(req: Request, res: Response) {
        const { data, error } = await CreateTreinoSchema.safeParseAsync(req.body);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const treinoResult = await Database.Treino.create(data);

        res.status(201).json({ message: "Treino criado com sucesso", id: treinoResult.insertId });
    }

    public static async update(req: Request, res: Response) {
        const { data, error } = await UpdateTreinoSchema.safeParseAsync({ ...req.body, id: req.params.id });
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        await Database.Treino.update(data);
        res.json({ message: "Treino atualizado com sucesso" });
    }

    public static async delete(req: Request, res: Response) {
        const { data, error } = await DeleteTreinoSchema.safeParseAsync(req.params);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        await Database.Treino.delete(data.id);
        res.json({ message: "Treino deletado com sucesso" });
    }

    public static async show(req: Request, res: Response) {
        const { data, error } = await ShowTreinoSchema.safeParseAsync(req.params);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const treino = await Database.Treino.findById(data.id);
        if (!treino) {
            return res.status(404).json({ message: "Treino não encontrado" });
        }

        res.json(treino);
    }
}
