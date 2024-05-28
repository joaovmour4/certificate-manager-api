import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Empresa from "./EmpresaSchema";
import Usuario from "./userSchema";

interface UsuarioEmpresaAttributes{
    idUsuario: number
    idEmpresa: number
}

const UsuarioEmpresa = sequelize.define('UsuarioEmpresa', {},{
    tableName: 'UsuarioEmpresa',
    timestamps: false
})

Empresa.belongsToMany(Usuario, {through: UsuarioEmpresa, foreignKey: 'idEmpresa'})
Usuario.belongsToMany(Empresa, {through: UsuarioEmpresa, foreignKey: 'idUsuario'})

export { UsuarioEmpresaAttributes }
export default UsuarioEmpresa