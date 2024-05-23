import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Competencia from "./CompetenciaSchema";
import Obrigacao from "./ObrigacaoSchema";

interface AtividadeAttributes{
    idAtividade: number
    idCompetencia: number
    idObrigacao: number
}

const Atividade = sequelize.define('Atividades', {
    idAtividade: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    idObrigacao: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Obrigacao,
            key: 'idObrigacao'
        },
        primaryKey: false
    },
    idCompetencia: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Competencia,
            key: 'idCompetencia'
        },
        primaryKey: false
    }
},{
    tableName:'Atividade',
    timestamps: false
})

Atividade.belongsTo(Competencia, { foreignKey: 'idCompetencia' })
Atividade.belongsTo(Obrigacao, { foreignKey: 'idObrigacao' })
Obrigacao.belongsToMany(Competencia, {through: Atividade, foreignKey: 'idObrigacao'})
Competencia.belongsToMany(Obrigacao, {through: Atividade, foreignKey: 'idCompetencia'})

export { AtividadeAttributes }
export default Atividade