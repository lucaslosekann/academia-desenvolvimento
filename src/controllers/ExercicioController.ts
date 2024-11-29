import { Request, Response } from "express";
import Database from "../database";
import { CreateExercicioSchema, DeleteExercicioSchema, ShowExercicioSchema, UpdateExercicioSchema } from "../schemas/ExercicioSchema";

export default class ExercicioController {
    public static async index(req: Request, res: Response) {
        const exercicios = await Database.Exercicio.findAll();
        res.json(exercicios);
    }

    public static async create(req: Request, res: Response) {
        const { data, error } = await CreateExercicioSchema.safeParseAsync(req.body);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const exercicioResult = await Database.Exercicio.create(data);

        res.status(201).json({ message: "Exercicio criado com sucesso", id: exercicioResult.insertId });
    }

    public static async update(req: Request, res: Response) {
        const { data, error } = await UpdateExercicioSchema.safeParseAsync({ ...req.body, id: req.params.id });
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        await Database.Exercicio.update(data);
        res.json({ message: "Exercicio atualizado com sucesso" });
    }

    public static async delete(req: Request, res: Response) {
        const { data, error } = await DeleteExercicioSchema.safeParseAsync(req.params);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        await Database.Exercicio.delete(data.id);
        res.json({ message: "Exercicio deletado com sucesso" });
    }

    public static async show(req: Request, res: Response) {
        const { data, error } = await ShowExercicioSchema.safeParseAsync(req.params);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const exercicio = await Database.Exercicio.findById(data.id);
        if (!exercicio) {
            return res.status(404).json({ message: "Exercicio não encontrado" });
        }

        res.json(exercicio);
    }
}
