import { Request, Response } from "express";
import UsuarioEmpresa from "../schemas/userEmpresaSchema";

export default class UsuarioEmpresaController{
    // Atribuindo empresa à um usuário
    static async associateEmpresa(req: Request, res: Response){
        try{
            const idEmpresa: number = req.body.idEmpresa
            const idUsuario: number = req.body.idUsuario

            const userEmpresa = await UsuarioEmpresa.create({
                idEmpresa: idEmpresa,
                idUsuario: idUsuario
            })

            if(userEmpresa)
                return res.status(201).json({
                    message: 'Empresa atribuida com sucesso.',
                    userEmpresa
                })
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    // Removendo atribuição de empresa à um usuário
    static async removeAssociationEmpresa(req: Request, res: Response){
        try{
            const idEmpresa: number = req.body.idEmpresa
            const idUsuario: number = req.body.idUsuario

            const userEmpresa = await UsuarioEmpresa.destroy({where:{
                idEmpresa: idEmpresa,
                idUsuario: idUsuario
            }})

            if(userEmpresa)
                return res.status(201).json({
                    message: 'Atribuição removida com sucesso.'
                })
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }    
}