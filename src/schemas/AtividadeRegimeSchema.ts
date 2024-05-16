import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Regime from "./RegimeSchema";
import Atividade from "./AtividadeSchema";

interface RegimeAtividadeAttributes{
    idRegime: number
    idAtividade: number
}

const RegimeAtividade = sequelize.define('RegimeAtividade', {},{
    timestamps: false
})

Atividade.belongsToMany(Regime, {through: RegimeAtividade})
Regime.belongsToMany(Atividade, {through: RegimeAtividade})

export { RegimeAtividadeAttributes }
export default RegimeAtividade