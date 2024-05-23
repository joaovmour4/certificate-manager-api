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

Empresa.belongsToMany(Usuario, {through: UsuarioEmpresa})
Usuario.belongsToMany(Empresa, {through: UsuarioEmpresa})

export { UsuarioEmpresaAttributes }
export default UsuarioEmpresa