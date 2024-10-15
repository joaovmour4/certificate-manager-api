import Atividade from "../schemas/AtividadeSchema";
import { Request, Response } from "express";
import EmpresaAtividade from "../schemas/EmpresaAtividadeSchema";

export default class AtividadeController{
    static async createAtividade(req: Request, res: Response){
        try{
            const idCompetencia = req.body.idCompetencia
            const idObrigacao = req.body.idObrigacao
            const idEmpresa = req.body.idEmpresa

            if(!idEmpresa)
                return res.status(400).json({message: 'É necessário informar uma empresa.'})
            
            const atividade = await Atividade.findOne({
                where:{
                    idObrigacao: idObrigacao,
                    idCompetencia: idCompetencia 
                }
            })

            if(!atividade)
                return res.status(400).json({message: 'Não foi possível inserir o registro.'})

            await EmpresaAtividade.create({
                idObrigacao: idObrigacao,
                EmpresaIdEmpresa: idEmpresa,
                AtividadeIdAtividade: atividade.dataValues.idAtividade
            })


            return res.status(201).json({message: 'Atividade criada com sucesso.', atividade})
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getAtividades(req: Request, res: Response){
        try{
            const atividades = await Atividade.findAll()
            return res.status(200).json(atividades)

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}