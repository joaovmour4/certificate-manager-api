import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

interface ExcecaoAttributes{
    idExcecao: number
    excecaoName: string
}

const Excecao = sequelize.define('Excecoes', {
    idExcecao: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    excecaoName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName:'Excecao',
    timestamps: true,
    paranoid: true,
})

export { ExcecaoAttributes }
export default Excecao