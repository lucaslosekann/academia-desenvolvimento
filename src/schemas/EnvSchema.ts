import { z } from "zod";

export const EnvSchema = z.object({
    DATABASE_HOST: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_PORT: z.coerce.number(),
});
