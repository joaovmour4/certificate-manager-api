import { DataTypes, DateDataType, NumberDataType } from "sequelize";
import sequelize from "../config/sequelize";
import CompetenciaEmpresa from "./CompetenciaEmpresa";
import Atividade from "./AtividadeSchema";

interface CompetenciaEmpresaRealizaAtividadeAttributes{
    idCompetencia: number
    idEmpresa: number
    idAtividade: NumberDataType
    dataRealizacao: DateDataType
}

const CompetenciaEmpresaRealizaAtividade = sequelize.define('CompetenciaEmpresaRealizaAtividade', {
    dataRealizacao: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    timestamps: false
})

CompetenciaEmpresa.belongsToMany(Atividade, {through: CompetenciaEmpresaRealizaAtividade})
Atividade.belongsToMany(CompetenciaEmpresa, {through: CompetenciaEmpresaRealizaAtividade})

export { CompetenciaEmpresaRealizaAtividadeAttributes }
export default CompetenciaEmpresaRealizaAtividade