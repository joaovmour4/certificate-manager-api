import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Obrigacao from "./ObrigacaoSchema";
import Excecao from "./ExcecaoSchema";

interface ObrigacaoExcecaoAttributes{
    idExcecao: number
    idObrigacao: number
}

const ObrigacaoExcecao = sequelize.define('ObrigacaoExcecao', {},{
    tableName: 'ObrigacaoExcecao',
    timestamps: false
})

Obrigacao.belongsToMany(Excecao, {through: ObrigacaoExcecao, foreignKey: 'idObrigacao'})
Excecao.belongsToMany(Obrigacao, {through: ObrigacaoExcecao, foreignKey: 'idExcecao'})

export { ObrigacaoExcecaoAttributes }
export default ObrigacaoExcecao