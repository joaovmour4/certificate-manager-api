import { DataTypes, HasMany, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface RegimeAttributes{
    idRegime: number
    regimeName: string
}

const Regime = sequelize.define('Regimes', {
    idRegime: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    regimeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName:'Regime',
    timestamps: false,
    paranoid: false
})

export { RegimeAttributes }
export default Regime