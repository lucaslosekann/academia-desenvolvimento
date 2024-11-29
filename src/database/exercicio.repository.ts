import { ResultSetHeader } from "mysql2";
import { PoolManager } from ".";

export type Exercicio = {
    id: number;
    treino_id: number;
    nome: string;
    repeticoes: number;
    musculo: string;
};

export default class ExercicioRepository {
    static async findAll() {
        return PoolManager.query<Exercicio[]>("SELECT * FROM Exercicio");
    }

    static async findById(id: number): Promise<Exercicio | null> {
        return PoolManager.query<Exercicio[]>("SELECT * FROM Exercicio WHERE id = ?", [id]).then((results) => results[0] || null);
    }

    static async findByTreinoId(id: number) {
        return PoolManager.query<Exercicio[]>("SELECT * FROM Exercicio WHERE treino_id = ?", [id]);
    }

    static async create(exercicio: Omit<Exercicio, "id">) {
        return PoolManager.query<ResultSetHeader>("INSERT INTO Exercicio (treino_id, nome, repeticoes, musculo) VALUES (?, ?, ?, ?)", [
            exercicio.treino_id,
            exercicio.nome,
            exercicio.repeticoes,
            exercicio.musculo,
        ]);
    }

    static async update(exercicio: Exercicio): Promise<void> {
        return PoolManager.query<void>("UPDATE Exercicio SET nome = ?, repeticoes = ?, musculo = ? WHERE id = ?", [
            exercicio.nome,
            exercicio.repeticoes,
            exercicio.musculo,
            exercicio.id,
        ]);
    }

    static async delete(id: number): Promise<void> {
        return PoolManager.query<void>("DELETE FROM Exercicio WHERE id = ?", [id]);
    }
}

export const CreateExercicioTable = async () => {
    await PoolManager.query(`
        CREATE TABLE IF NOT EXISTS Exercicio(
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            nome VARCHAR(50) NOT NULL,
            treino_id INTEGER NOT NULL, 
            repeticoes INTEGER  NOT NULL,
            musculo VARCHAR(100)  NOT NULL,
            FOREIGN KEY(treino_id) REFERENCES Treino(id) ON DELETE CASCADE
        );
    `);
};
