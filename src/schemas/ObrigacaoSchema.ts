import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Regime from "./RegimeSchema";
import RegimeAtividade from "./RegimeObrigacaoSchema";

interface ObrigacaoAttributes{
    idObrigacao: number
    obrigacaoName: string
    obrigacaoShortName: string
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
        allowNull: false
    }
}, {
    tableName:'Obrigacao',
    timestamps: false,
    paranoid: false
})

export { ObrigacaoAttributes }
export default Obrigacao