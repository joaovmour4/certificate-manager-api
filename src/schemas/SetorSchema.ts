import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

interface SetorAttributes{
    idSetor: number
    SetorName: string
}

const Setor = sequelize.define('Setor', {
    idSetor: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    setorName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    tableName:'Setor',
    timestamps: false,
    paranoid: true
})

export { SetorAttributes }
export default Setor