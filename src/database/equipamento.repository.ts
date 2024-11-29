import { ResultSetHeader } from "mysql2";
import { PoolManager } from ".";

export type Equipamento = {
    id: number;
    tipo: string;
    estado: string;
    ult_data: string;
};

export default class EquipamentoRepository {
    static async findAll() {
        return PoolManager.query<Equipamento[]>("SELECT * FROM Equipamento");
    }

    static async findById(id: number): Promise<Equipamento | null> {
        return PoolManager.query<Equipamento[]>("SELECT * FROM Equipamento WHERE id = ?", [id]).then((results) => results[0] || null);
    }

    static async create(equipamento: Omit<Equipamento, "id">) {
        return PoolManager.query<ResultSetHeader>("INSERT INTO Equipamento (tipo, estado, ult_data) VALUES (?, ?, ?)", [
            equipamento.tipo,
            equipamento.estado,
            equipamento.ult_data,
        ]);
    }

    static async update(equipamento: Equipamento): Promise<void> {
        return PoolManager.query<void>("UPDATE Equipamento SET tipo = ?, estado = ?, ult_data = ? WHERE id = ?", [
            equipamento.tipo,
            equipamento.estado,
            equipamento.ult_data,
            equipamento.id,
        ]);
    }

    static async delete(id: number): Promise<void> {
        return PoolManager.query<void>("DELETE FROM Equipamento WHERE id = ?", [id]);
    }
}

export const CreateEquipamentoTable = async () => {
    await PoolManager.query(`
        CREATE TABLE IF NOT EXISTS Equipamento(
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            tipo VARCHAR(40)  NOT NULL,
            estado VARCHAR(40)  NOT NULL,
            ult_data DATE  NOT NULL
        );
    `);
};
