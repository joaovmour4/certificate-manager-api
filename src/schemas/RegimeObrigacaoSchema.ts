import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Regime from "./RegimeSchema";
import Obrigacao from "./ObrigacaoSchema";

interface RegimeObrigacaoAttributes{
    RegimeIdRegime: number
    ObrigacaoIdObrigacao: number
}

const RegimeObrigacao = sequelize.define('RegimeObrigacao', {},{
    tableName: 'RegimeObrigacao',
    timestamps: false
})

Obrigacao.belongsToMany(Regime, {through: RegimeObrigacao})
Regime.belongsToMany(Obrigacao, {through: RegimeObrigacao})

export { RegimeObrigacaoAttributes }
export default RegimeObrigacao