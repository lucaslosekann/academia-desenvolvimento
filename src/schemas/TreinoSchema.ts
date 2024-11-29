import { z } from "zod";

export const CreateTreinoSchema = z.object({
    aluno_id: z.number(),
    descricao: z.string().max(40),
    frequencia: z.number(),
});

export const UpdateTreinoSchema = z.object({
    id: z.coerce.number(),
    aluno_id: z.number(),
    descricao: z.string().max(40),
    frequencia: z.number(),
});

export const DeleteTreinoSchema = z.object({
    id: z.coerce.number(),
});

export const ShowTreinoSchema = z.object({
    id: z.coerce.number(),
});
