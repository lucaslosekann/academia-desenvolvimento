import { Request, Response } from "express";
import Database from "../database";
import {
    CreateEquipamentoSchema,
    DeleteEquipamentoSchema,
    ShowEquipamentoSchema,
    UpdateEquipamentoSchema,
} from "../schemas/EquipamentoSchema";

export default class EquipamentoController {
    public static async index(req: Request, res: Response) {
        const equipamentos = await Database.Equipamento.findAll();
        res.json(equipamentos);
    }

    public static async create(req: Request, res: Response) {
        const { data, error } = await CreateEquipamentoSchema.safeParseAsync(req.body);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const equipamentoResult = await Database.Equipamento.create(data);

        res.status(201).json({ message: "Equipamento criado com sucesso", id: equipamentoResult.insertId });
    }

    public static async update(req: Request, res: Response) {
        const { data, error } = await UpdateEquipamentoSchema.safeParseAsync({ ...req.body, id: req.params.id });
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        await Database.Equipamento.update(data);
        res.json({ message: "Equipamento atualizado com sucesso" });
    }

    public static async delete(req: Request, res: Response) {
        const { data, error } = await DeleteEquipamentoSchema.safeParseAsync(req.params);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        await Database.Equipamento.delete(data.id);
        res.json({ message: "Equipamento deletado com sucesso" });
    }

    public static async show(req: Request, res: Response) {
        const { data, error } = await ShowEquipamentoSchema.safeParseAsync(req.params);
        if (error) {
            return res.status(400).json({ errors: error.errors });
        }

        const equipamento = await Database.Equipamento.findById(data.id);
        if (!equipamento) {
            return res.status(404).json({ message: "Equipamento não encontrado" });
        }

        res.json(equipamento);
    }
}
