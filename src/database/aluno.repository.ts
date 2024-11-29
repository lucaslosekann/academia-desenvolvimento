import { ResultSetHeader } from "mysql2";
import { pool, PoolManager } from ".";
import { Telefone } from "./telefone.repository";
import { Endereco } from "./endereco.repository";

export type Aluno = {
    id: number;
    nome: string;
    email: string;
    plano_pag: string;
    endereco_id: number;
};

export default class AlunoRepository {
    static async findAll() {
        return PoolManager.query<Aluno[]>("SELECT * FROM Aluno");
    }

    static async findById(id: number): Promise<(Aluno & Omit<Endereco, "id">) | null> {
        return PoolManager.query<(Aluno & Omit<Endereco, "id">)[]>(
            `
            SELECT Aluno.*, e.rua, e.cep, e.bairro, e.numero FROM Aluno
            INNER JOIN Endereco e ON Aluno.endereco_id = e.id
            WHERE Aluno.id = ?
            `,
            [id]
        ).then((results) => results[0] || null);
    }

    static async create(
        aluno: Omit<Aluno, "id" | "endereco_id">,
        telefones: Omit<Telefone, "id" | "aluno_id">[],
        endereco: Omit<Endereco, "id">
    ): Promise<ResultSetHeader> {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [enderecoR] = await conn.query<ResultSetHeader>("INSERT INTO Endereco (rua, cep, bairro, numero) VALUES (?, ?, ?, ?)", [
                endereco.rua,
                endereco.cep,
                endereco.bairro,
                endereco.numero,
            ]);

            const [r] = await conn.query<ResultSetHeader>("INSERT INTO Aluno (nome, email, plano_pag, endereco_id) VALUES (?, ?, ?, ?)", [
                aluno.nome,
                aluno.email,
                aluno.plano_pag,
                enderecoR.insertId,
            ]);
            if (telefones.length > 0) {
                await conn.query("INSERT INTO Telefone (telefone, ddd, aluno_id) VALUES ?", [
                    telefones.map((t) => [t.telefone, t.ddd, r.insertId]),
                ]);
            }
            await conn.commit();
            return r;
        } finally {
            conn.release();
        }
    }

    static async update(aluno: Omit<Aluno, "endereco_id">): Promise<void> {
        return PoolManager.query<void>("UPDATE Aluno SET nome = ?, email = ?, plano_pag = ? WHERE id = ?", [
            aluno.nome,
            aluno.email,
            aluno.plano_pag,
            aluno.id,
        ]);
    }

    static async delete(id: number): Promise<void> {
        return PoolManager.query<void>("DELETE FROM Aluno WHERE id = ?", [id]);
    }
}

export const CreateAlunoTable = async () => {
    await PoolManager.query(`
        CREATE TABLE IF NOT EXISTS Aluno(
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        endereco_id INTEGER NOT NULL,
        nome VARCHAR(50) NOT NULL,
        plano_pag VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        FOREIGN KEY(endereco_id) REFERENCES Endereco(id)
        );
    `);
};
