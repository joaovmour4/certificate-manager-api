import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface UsuarioAttributes{
    idUsuario: number
    username: string
    email: string
    login: string
    password: string
}

const Usuario = sequelize.define('Usuarios', {
    idUsuario: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: "Usuario",
    timestamps: true,
    paranoid: false
})

export { UsuarioAttributes }
export default Usuario