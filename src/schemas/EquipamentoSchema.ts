import { z } from "zod";

export const CreateEquipamentoSchema = z.object({
    tipo: z.string().max(40),
    estado: z.string().max(40),
    ult_data: z.string().date(),
});

export const UpdateEquipamentoSchema = z.object({
    id: z.coerce.number(),
    tipo: z.string().max(40),
    estado: z.string().max(40),
    ult_data: z.string().date(),
});

export const DeleteEquipamentoSchema = z.object({
    id: z.coerce.number(),
});

export const ShowEquipamentoSchema = z.object({
    id: z.coerce.number(),
});
