import Atividade, { AtividadeAttributes } from "../schemas/AtividadeSchema";
import { Request, Response } from "express";

export default class atividadeController{
    static async createAtividade(req: Request, res: Response){
        try{
            const atividadeName: string = req.body.name
            if(!atividadeName)
                return res.status(400).json({error: 'Informe o nome da atividade.'})
            const newAtividade = await Atividade.create({
                atividadeName: atividadeName,

            })
            
            return res.status(201).json({message: 'Atividade inserida com sucesso.', newAtividade})


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
            const idAtividade: number = Number(req.params.id)

            if(!idAtividade)
                return res.status(400).json({error: 'Informe um id de registro para remover.'})

            const atividade = await Atividade.findByPk(idAtividade)
            if(!idAtividade)
                return res.status(404).json({error: 'Registro não encontrado.'})

            try{
                await atividade?.destroy()
                return res.status(200).json({message: 'Atividade removida com sucesso.'})
            }catch(err: any){
                return res.status(500).json({error: err.message})
            }
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async insertAct(req: Request, res: Response){
        const act = ['DIEF', 'ICMS Normal', 'DAE', 'SPED FISCAL', 'EFD REINF', 'ISSQN', 'ISSQN1', 'ISSQN2']

        for(let i=0; i<act.length; i++){
            await Atividade.create({atividadeName: act[i]})
        }

        return res.status(200).json({message: 'success.'})
    }
}