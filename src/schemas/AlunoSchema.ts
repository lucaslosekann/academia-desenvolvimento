import { z } from "zod";

export const CreateAlunoSchema = z.object({
    nome: z.string().max(50),
    email: z.string().email().max(50),
    plano_pag: z.string().max(50),
    endereco: z.object({
        rua: z.string().max(100),
        cep: z.string().length(8),
        bairro: z.string().max(40),
        numero: z
            .number()
            .transform((v) => v.toString())
            .refine((v) => v.length <= 5),
    }),
    telefones: z.array(
        z.object({
            telefone: z
                .string()
                .max(9)
                .refine((v) => !isNaN(Number(v))),

            ddd: z
                .string()
                .max(2)
                .refine((v) => !isNaN(Number(v))),
        })
    ),
});

export const UpdateAlunoSchema = z.object({
    nome: z.string().max(50),
    email: z.string().email().max(50),
    plano_pag: z.string().max(50),
    id: z.coerce.number(),
});

export const DeleteAlunoSchema = z.object({
    id: z.coerce.number(),
});

export const ShowAlunoSchema = z.object({
    id: z.coerce.number(),
});
