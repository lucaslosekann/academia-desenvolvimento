import { ResultSetHeader } from "mysql2";
import { PoolManager } from ".";

export type Treino = {
    id: number;
    aluno_id: number;
    descricao: string;
    frequencia: number;
};

export default class TreinoRepository {
    static async findAll() {
        return PoolManager.query<Treino[]>("SELECT * FROM Treino");
    }

    static async findById(id: number): Promise<Treino | null> {
        return PoolManager.query<Treino[]>("SELECT * FROM Treino WHERE id = ?", [id]).then((results) => results[0] || null);
    }

    static async findByAlunoId(id: number) {
        return PoolManager.query<Treino[]>("SELECT * FROM Treino WHERE aluno_id = ?", [id]);
    }

    static async create(treino: Omit<Treino, "id">) {
        return PoolManager.query<ResultSetHeader>("INSERT INTO Treino (aluno_id, descricao, frequencia) VALUES (?, ?, ?)", [
            treino.aluno_id,
            treino.descricao,
            treino.frequencia,
        ]);
    }

    static async update(treino: Treino): Promise<void> {
        return PoolManager.query<void>("UPDATE Treino SET descricao = ?, frequencia = ? WHERE id = ?", [
            treino.descricao,
            treino.frequencia,
            treino.id,
        ]);
    }

    static async delete(id: number): Promise<void> {
        return PoolManager.query<void>("DELETE FROM Treino WHERE id = ?", [id]);
    }
}

export const CreateTreinoTable = async () => {
    await PoolManager.query(`
        CREATE TABLE IF NOT EXISTS Treino(
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            aluno_id INTEGER  NOT NULL, 
            descricao VARCHAR(40)  NOT NULL,
            frequencia INTEGER  NOT NULL,
            FOREIGN KEY(aluno_id) REFERENCES Aluno(id) ON DELETE CASCADE
        );
    `);
};
