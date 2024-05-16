import { Response, Request } from "express"
import Competencia from "../schemas/CompetenciaSchema"


export default class competenciaController{
    static async createCompetencia(req: Request, res: Response){
        try{
            const mes = req.body.mes
            const ano = req.body.ano

            const competencia = await Competencia.create({
                mes: mes,
                ano: ano
            })

            if(!competencia)
                return res.status(400).json({error: 'Verifique os dados fornecidos.'})
            return res.status(201).json({message: 'Competência criada com sucesso.', competencia})
       
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getCompetencias(req: Request, res: Response){
        try{
            const competencias = await Competencia.findAll()
            return res.status(200).json(competencias)
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}