import Atividade from "../schemas/AtividadeSchema";
import { Request, Response } from "express";

export default class AtividadeController{
    static async createAtividade(req: Request, res: Response){
        try{
            const idCompetencia = req.body.idCompetencia
            const idAtividade = req.body.idAtividade

            const atividade = await Atividade.create({
                idCompetencia: idCompetencia,
                idAtividade: idAtividade
            })

            if(!atividade)
                return res.status(400).json({error: 'Não foi possível inserir o registro.'})
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
    static async deleteAtividade(req: Request, res: Response){
        try{
            
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}