import { DataTypes, HasOne, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";
import Regime from "./RegimeSchema";
import Usuario from "./userSchema";

interface EmpresaAttributes{
    idEmpresa: number
    username: string
    email: string
    login: string
    password: string
}

const Empresa = sequelize.define('Empresas', {
    idEmpresa: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nameEmpresa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activeEmpresa: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    codigoQuestor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cnpjEmpresa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    inscricaoEmpresa: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    representante: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName:'Empresa',
    timestamps: true,
    paranoid: true
})

Empresa.belongsTo(Regime, {foreignKey: 'idRegime'})
// Empresa.belongsToMany(Usuario, {
//     through: 'UsuarioEmpresa', 
//     as: 'responsaveis',
//     foreignKey: 'idEmpresa',
//     otherKey: 'idUsuario'
// })

export { EmpresaAttributes }
export default Empresa