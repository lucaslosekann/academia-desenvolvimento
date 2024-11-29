import { ResultSetHeader } from "mysql2";
import { PoolManager } from ".";

export type Telefone = {
    id: number;
    telefone: string;
    ddd: string;
    aluno_id: number;
};

export default class TelefoneRepository {
    static async findAll() {
        return PoolManager.query<Telefone[]>("SELECT * FROM Telefone");
    }

    static async findById(id: number): Promise<Telefone | null> {
        return PoolManager.query<Telefone[]>("SELECT * FROM Telefone WHERE id = ?", [id]).then((results) => results[0] || null);
    }

    static async findByAlunoId(id: number) {
        return PoolManager.query<Telefone[]>("SELECT * FROM Telefone WHERE aluno_id = ?", [id]);
    }

    static async create(telefone: Omit<Telefone, "id">) {
        return PoolManager.query<ResultSetHeader>("INSERT INTO Telefone (ddd, telefone, aluno_id) VALUES (?, ?, ?)", [
            telefone.ddd,
            telefone.telefone,
            telefone.aluno_id,
        ]);
    }

    static async update(telefone: Omit<Telefone, "aluno_id">): Promise<void> {
        return PoolManager.query<void>("UPDATE Telefone SET telefone = ?, ddd = ? WHERE id = ?", [
            telefone.telefone,
            telefone.ddd,
            telefone.id,
        ]);
    }

    static async delete(id: number): Promise<void> {
        return PoolManager.query<void>("DELETE FROM Telefone WHERE id = ?", [id]);
    }
}

export const CreateTelefoneTable = async () => {
    await PoolManager.query(`
        CREATE TABLE IF NOT EXISTS Telefone(
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        aluno_id INTEGER NOT NULL,
        telefone VARCHAR(9) NOT NULL,
        ddd VARCHAR(2) NOT NULL,
        FOREIGN KEY(aluno_id) REFERENCES Aluno(id) ON DELETE CASCADE
        );
    `);
};
