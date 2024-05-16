import { Request, Response } from "express";
import RegimeAtividade from "../schemas/AtividadeRegimeSchema";

export default class RegimeAtividadeController{
    // Atribuindo empresa à um usuário
    static async associateAtividade(req: Request, res: Response){
        try{
            const idAtividade: number = req.body.idAtividade
            const idRegime: number = req.body.idRegime

            const regimeAtividade = await RegimeAtividade.create({
                AtividadeIdAtividade: idAtividade,
                RegimeIdRegime: idRegime
            })

            if(regimeAtividade)
                return res.status(201).json({
                    message: 'Atividade atribuida com sucesso.',
                    regimeAtividade
                })
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    // Removendo atribuição de Atividade à um usuário
    static async removeAssociationAtividade(req: Request, res: Response){
        try{
            const idAtividade: number = req.body.idAtividade
            const idRegime: number = req.body.idRegime

            const regimeAtividade = await RegimeAtividade.destroy({where:{
                EmpresaIdEmpresa: idAtividade,
                UsuarioidRegime: idRegime
            }})

            if(regimeAtividade)
                return res.status(201).json({
                    message: 'Atribuição removida com sucesso.'
                })
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }    
}