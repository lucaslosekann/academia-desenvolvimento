import { z } from "zod";

export const CreateExercicioSchema = z.object({
    treino_id: z.number(),
    nome: z.string().max(50),
    repeticoes: z.number(),
    musculo: z.string().max(100),
});

export const UpdateExercicioSchema = z.object({
    id: z.coerce.number(),
    treino_id: z.number(),
    nome: z.string().max(50),
    repeticoes: z.number(),
    musculo: z.string().max(100),
});

export const DeleteExercicioSchema = z.object({
    id: z.coerce.number(),
});

export const ShowExercicioSchema = z.object({
    id: z.coerce.number(),
});
