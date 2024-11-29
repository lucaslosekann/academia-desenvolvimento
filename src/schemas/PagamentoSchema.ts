import { z } from "zod";

export const CreatePagamentoSchema = z.object({
    aluno_id: z.number(),
    data: z.string().regex(/^(\d{4})\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01]) ([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/), //yyyy-mm-dd hh:mm:ss
    valor: z.number(),
    status: z.string().max(20),
});

export const UpdatePagamentoSchema = z.object({
    id: z.coerce.number(),
    status: z.string().max(20),
});

export const DeletePagamentoSchema = z.object({
    id: z.coerce.number(),
});
