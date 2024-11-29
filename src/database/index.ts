import mysql from "mysql2/promise";
import { ENV } from "../server";

import AlunoRepository, { CreateAlunoTable } from "./aluno.repository";
import EnderecoRepository, { CreateEnderecoTable } from "./endereco.repository";
import TelefoneRepository, { CreateTelefoneTable } from "./telefone.repository";
import PagamentoRepository, { CreatePagamentoTable } from "./pagamento.repository";
import EquipamentoRepository, { CreateEquipamentoTable } from "./equipamento.repository";
import TreinoRepository, { CreateTreinoTable } from "./treino.repository";
import ExercicioRepository, { CreateExercicioTable } from "./exercicio.repository";

//CREATE DATABASE IF NOT EXISTS `${ENV.DATABASE_NAME}`;
export const pool = mysql.createPool({
    host: ENV.DATABASE_HOST,
    user: ENV.DATABASE_USER,
    password: ENV.DATABASE_PASSWORD,
    database: ENV.DATABASE_NAME,
    port: ENV.DATABASE_PORT,
});

export class PoolManager {
    static async query<T>(query: string, values?: any[]): Promise<T> {
        const [r] = await pool.query(query, values);
        return r as T;
    }
}

export default class Database {
    static Aluno = AlunoRepository;
    static Endereco = EnderecoRepository;
    static Telefone = TelefoneRepository;
    static Pagamento = PagamentoRepository;
    static Equipamento = EquipamentoRepository;
    static Treino = TreinoRepository;
    static Exercicio = ExercicioRepository;
}

//ORDER IS VERY IMPORTANT
export async function createTables() {
    await CreateEnderecoTable();
    await CreateAlunoTable();
    await CreateTelefoneTable();
    await CreateEquipamentoTable();
    await CreatePagamentoTable();
    await CreateTreinoTable();
    await CreateExercicioTable();
}
