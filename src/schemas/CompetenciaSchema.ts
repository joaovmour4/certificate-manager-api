import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

interface CompetenciaAttributes{
    idCompetencia: number
    mes: number
    ano: number
}

const Competencia = sequelize.define('Competencias', {
    idCompetencia: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    mes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName:'Competencia',
    timestamps: false,
    paranoid: false
})

export { CompetenciaAttributes }
export default Competencia