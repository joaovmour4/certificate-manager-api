import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import Empresa from "./EmpresaSchema";
import Setor from "./SetorSchema";

interface SetorEmpresaAttributes{
    idSetor: number
    idEmpresa: number
}

const SetorEmpresa = sequelize.define('SetorEmpresa', {},{
    tableName: 'SetorEmpresa',
    timestamps: false
})

Empresa.belongsToMany(Setor, {through: SetorEmpresa, foreignKey: 'idEmpresa'})
Setor.belongsToMany(Empresa, {through: SetorEmpresa, foreignKey: 'idSetor'})

export { SetorEmpresaAttributes }
export default SetorEmpresa