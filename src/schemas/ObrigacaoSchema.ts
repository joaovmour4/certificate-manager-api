import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Setor from "./SetorSchema";

interface ObrigacaoAttributes{
    idObrigacao: number
    obrigacaoName: string
    obrigacaoShortName: string
    idSetor: number
}

const Obrigacao = sequelize.define('Obrigacaos', {
    idObrigacao: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    obrigacaoName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    obrigacaoShortName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    idSetor: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Setor,
            key: 'idSetor'
        }
    }
}, {
    tableName:'Obrigacao',
    timestamps: true,
    paranoid: true,
})

Obrigacao.belongsTo(Setor, {foreignKey: 'idSetor'})
Setor.hasMany(Obrigacao, {foreignKey: 'idSetor'})

export { ObrigacaoAttributes }
export default Obrigacao