import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Empresa from "./EmpresaSchema";
import Setor from "./SetorSchema";
import Usuario from "./userSchema";

interface SetorEmpresaAttributes{
    idSetor: number
    idEmpresa: number
}

const SetorEmpresa = sequelize.define('SetorEmpresa', {
    idUsuarioResponsavel: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'idUsuario'
        }
    }
},{
    tableName: 'SetorEmpresa',
    timestamps: false
})

Empresa.belongsToMany(Setor, {through: SetorEmpresa, foreignKey: 'idEmpresa'})
Setor.belongsToMany(Empresa, {through: SetorEmpresa, foreignKey: 'idSetor'})

SetorEmpresa.belongsTo(Setor, {foreignKey: 'idSetor'})
Setor.hasMany(SetorEmpresa, {foreignKey: 'idSetor'})

SetorEmpresa.belongsTo(Empresa, {foreignKey: 'idEmpresa'})
Empresa.hasMany(SetorEmpresa, {foreignKey: 'idEmpresa'})

Usuario.hasMany(SetorEmpresa, {foreignKey: 'idUsuarioResponsavel'})
SetorEmpresa.belongsTo(Usuario, {foreignKey: 'idUsuarioResponsavel'})

export { SetorEmpresaAttributes }
export default SetorEmpresa