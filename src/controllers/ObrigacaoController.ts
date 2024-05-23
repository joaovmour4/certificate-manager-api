import Obrigacao, { ObrigacaoAttributes } from "../schemas/ObrigacaoSchema";
import { Request, Response } from "express";

export default class ObrigacaoController{
    static async createObrigacao(req: Request, res: Response){
        try{
            const obrigacaoName: string = req.body.name
            if(!obrigacaoName)
                return res.status(400).json({error: 'Informe o nome da Obrigacao.'})
            const newObrigacao = await Obrigacao.create({
                obrigacaoName: obrigacaoName,

            })
            
            return res.status(201).json({message: 'Obrigacao inserida com sucesso.', newObrigacao})


        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getObrigacoes(req: Request, res: Response){
        try{
            const obrigacoes = await Obrigacao.findAll()
            return res.status(200).json(obrigacoes)

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async deleteObrigacao(req: Request, res: Response){
        try{
            const idObrigacao: number = Number(req.params.id)

            if(!idObrigacao)
                return res.status(400).json({error: 'Informe um id de registro para remover.'})

            const obrigacao = await Obrigacao.findByPk(idObrigacao)
            if(!obrigacao)
                return res.status(404).json({error: 'Registro não encontrado.'})

            try{
                await obrigacao?.destroy()
                return res.status(200).json({message: 'Obrigacao removida com sucesso.'})
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
            await Obrigacao.create({obrigacaoName: act[i]})
        }

        return res.status(200).json({message: 'success.'})
    }
}