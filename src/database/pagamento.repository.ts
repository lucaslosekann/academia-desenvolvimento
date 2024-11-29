import { ResultSetHeader } from "mysql2";
import { PoolManager } from ".";
import { Aluno } from "./aluno.repository";

export type Pagamento = {
    id: number;
    aluno_id: number;
    data: string;
    valor: number;
    status: string;
};

export default class PagamentoRepository {
    static async findAll() {
        return PoolManager.query<(Pagamento & Aluno)[]>(`
            SELECT Pagamento.*, Aluno.email, Aluno.nome, Aluno.plano_pag FROM Pagamento
            INNER JOIN Aluno ON Pagamento.aluno_id = Aluno.id
        `);
    }

    static async findById(id: number): Promise<(Pagamento & Aluno) | null> {
        return PoolManager.query<(Pagamento & Aluno)[]>(
            "SELECT Pagamento.*, Aluno.email, Aluno.nome, Aluno.plano_pag FROM Pagamento INNER JOIN Aluno ON Pagamento.aluno_id = Aluno.id WHERE Pagamento.id = ?",
            [id]
        ).then((results) => results[0] || null);
    }

    static async findByAlunoId(aluno_id: number): Promise<Pagamento[]> {
        return PoolManager.query<Pagamento[]>("SELECT * FROM Pagamento WHERE aluno_id = ?", [aluno_id]);
    }

    static async create(pagamento: Omit<Pagamento, "id">) {
        return PoolManager.query<ResultSetHeader>("INSERT INTO Pagamento (aluno_id, data, valor, status) VALUES (?, ?, ?, ?)", [
            pagamento.aluno_id,
            pagamento.data,
            pagamento.valor,
            pagamento.status,
        ]);
    }

    static async update(pagamento: { id: Pagamento["id"]; status: Pagamento["status"] }): Promise<ResultSetHeader> {
        return PoolManager.query<ResultSetHeader>("UPDATE Pagamento SET status = ? WHERE id = ?", [pagamento.status, pagamento.id]);
    }

    static async delete(id: number): Promise<ResultSetHeader> {
        return PoolManager.query<ResultSetHeader>("DELETE FROM Pagamento WHERE id = ?", [id]);
    }
}

export const CreatePagamentoTable = async () => {
    await PoolManager.query(`
        CREATE TABLE IF NOT EXISTS Pagamento(
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            aluno_id INTEGER NOT NULL,
            data DATETIME NOT NULL,
            valor DOUBLE NOT NULL,
            status VARCHAR(20) NOT NULL,
            FOREIGN KEY(aluno_id) REFERENCES Aluno(id) ON DELETE CASCADE
        );
    `);
};
