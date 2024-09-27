import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Regime from "./RegimeSchema";
import Usuario from "./userSchema";
import { Json } from "sequelize/types/utils";

interface EmpresaAttributes{
    idEmpresa: number
    nameEmpresa: string
    activeEmpresa: boolean
    codigoQuestor: number
    cnpjEmpresa: string
    inscricaoMunicipal: string
    inscricaoEmpresa: string
    representante: string
    idUsuarioResponsavel: number
    situacaoFinanceiro: Json
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
    inscricaoMunicipal: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    situacaoIE: {
        type: DataTypes.STRING,
        allowNull: false
    },
    representante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    situacaoFinanceiro: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    tableName:'Empresa',
    timestamps: true,
    paranoid: true
})

Empresa.belongsTo(Regime, {foreignKey: 'idRegime'})
Empresa.belongsTo(Usuario, {foreignKey: 'idUsuarioResponsavel', as: 'responsavel'})

export { EmpresaAttributes }
export default Empresa