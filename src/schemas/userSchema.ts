import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";
import Empresa from "./EmpresaSchema";
import Setor from "./SetorSchema";

interface UsuarioAttributes{
    idUsuario: number
    username: string
    email: string
    login: string
    password: string
    cargo: string
    idSetor: number
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
        allowNull: false,

    },
    cargo: {
        type: DataTypes.ENUM,
        values: ['admin', 'supervisor', 'operador'],
        allowNull: false
    },
    idSetor: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Setor,
            key: 'idSetor'
        }
    }
}, {
    tableName: "Usuario",
    timestamps: true,
    paranoid: false,
    defaultScope: {
        attributes: { exclude: ['password'] }
    },
    scopes: {
        withPassword: {
            attributes: { include: ['password'] },
        }
    }
})

Setor.hasMany(Usuario, {foreignKey: 'idSetor'})
Usuario.belongsTo(Setor, {foreignKey: 'idSetor'})

export { UsuarioAttributes }
export default Usuario