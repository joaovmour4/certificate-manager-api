import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

interface AtividadeAttributes{
    idAtividade: number
    atividadeName: string
}

const Atividade = sequelize.define('Atividades', {
    idAtividade: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    atividadeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    atividadeShortName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName:'Atividade',
    timestamps: false,
    paranoid: false
})

export { AtividadeAttributes }
export default Atividade