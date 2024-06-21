import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Empresa from "./EmpresaSchema";
import Atividade from "./AtividadeSchema";
import Usuario from "./userSchema";

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
    },
    idUsuario: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references:{
            model: Usuario,
            key: 'idUsuario'
        }
    }
},{
    tableName: 'EmpresaAtividade',
    timestamps: false
})

Empresa.belongsToMany(Atividade, {through: EmpresaAtividade})
Atividade.belongsToMany(Empresa, {through: EmpresaAtividade})
EmpresaAtividade.belongsTo(Usuario, {foreignKey: 'idUsuario'})
Usuario.hasMany(EmpresaAtividade, {foreignKey: 'idUsuario'})

export { EmpresaAtividadeAttributes }
export default EmpresaAtividade