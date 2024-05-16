import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Competencia from "./CompetenciaSchema";
import Empresa from "./EmpresaSchema";

interface CompetenciaEmpresaAttributes{
    idCompetencia: number
    idEmpresa: number
    idRegime: number
}

const CompetenciaEmpresa = sequelize.define('CompetenciaEmpresa', {},{
    timestamps: false
})

Empresa.belongsToMany(Competencia, {through: CompetenciaEmpresa})
Competencia.belongsToMany(Empresa, {through: CompetenciaEmpresa})

export { CompetenciaEmpresaAttributes }
export default CompetenciaEmpresa