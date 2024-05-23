import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Empresa from "./EmpresaSchema";
import Atividade from "./AtividadeSchema";

interface EmpresaAtividadeAttributes{
    idCompetencia: number
    idAtividade: number
}

const EmpresaAtividade = sequelize.define('EmpresaAtividade', {
    idEmpresaAtividade: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    idObrigacao: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: false,
        references: {
            model: Atividade,
            key: 'idObrigacao'
        }
    },
    dataRealizacao: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    tableName: 'EmpresaAtividade',
    timestamps: false
})

Empresa.belongsToMany(Atividade, {through: EmpresaAtividade})
Atividade.belongsToMany(Empresa, {through: EmpresaAtividade})

export { EmpresaAtividadeAttributes }
export default EmpresaAtividade