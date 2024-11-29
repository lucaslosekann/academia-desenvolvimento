import { ResultSetHeader } from "mysql2";
import { PoolManager } from ".";

export type Endereco = {
    id: number;
    rua: string;
    cep: string;
    bairro: string;
    numero: string;
};

export default class EnderecoRepository {
    static async findAll(): Promise<Endereco[]> {
        return await PoolManager.query<Endereco[]>("SELECT * FROM Endereco");
    }

    static async create(endereco: Omit<Endereco, "id">) {
        return PoolManager.query<ResultSetHeader>("INSERT INTO Endereco (rua, cep, bairro, numero) VALUES (?, ?, ?, ?)", [
            endereco.rua,
            endereco.cep,
            endereco.bairro,
            endereco.numero,
        ]);
    }

    static async update(endereco: Endereco): Promise<void> {
        await PoolManager.query("UPDATE Endereco SET rua = ?, cep = ?, bairro = ?, numero = ? WHERE id = ?", [
            endereco.rua,
            endereco.cep,
            endereco.bairro,
            endereco.numero,
            endereco.id,
        ]);
    }

    static async delete(id: number): Promise<void> {
        await PoolManager.query("DELETE FROM Endereco WHERE id = ?", [id]);
    }

    static async findById(id: number): Promise<Endereco> {
        return await PoolManager.query<Endereco>("SELECT * FROM Endereco WHERE id = ?", [id]);
    }
}

export const CreateEnderecoTable = async () => {
    await PoolManager.query(`
        CREATE TABLE IF NOT EXISTS Endereco(
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        rua VARCHAR(100) NOT NULL,
        cep VARCHAR(8) NOT NULL,
        bairro VARCHAR(40) NOT NULL,
        numero VARCHAR(5) NOT NULL
        );
    `);
};
