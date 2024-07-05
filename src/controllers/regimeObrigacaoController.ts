import { Request, Response } from "express";
import RegimeObrigacao from "../schemas/RegimeObrigacaoSchema";

export default class RegimeObrigacaoController{
    static async associateObrigacao(req: Request, res: Response){
        try{
            const idObrigacao: number = req.body.idObrigacao
            const idRegime: number = req.body.idRegime

            const regimeObrigacao = await RegimeObrigacao.create({
                ObrigacaoIdObrigacao: idObrigacao,
                RegimeIdRegime: idRegime
            })

            if(regimeObrigacao)
                return res.status(201).json({
                    message: 'Obrigacao atribuida com sucesso.',
                    regimeObrigacao
                })
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async removeAssociationObrigacao(req: Request, res: Response){
        try{
            const idObrigacao: number = req.body.idObrigacao
            const idRegime: number = req.body.idRegime

            const regimeObrigacao = await RegimeObrigacao.destroy({where:{
                ObrigacaoIdObrigacao: idObrigacao,
                RegimeIdRegime: idRegime
            }})

            if(regimeObrigacao)
                return res.status(200).json({
                    message: 'Atribuição removida com sucesso.'
                })
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }    
}