import { Response, Request } from "express"
import Regime from "../schemas/RegimeSchema"
import Atividade from "../schemas/ObrigacaoSchema"


export default class regimeController{
    static async createRegime(req: Request, res: Response){
        try{
            const regimeName: string = req.body.name

            try{
                const newRegime = await Regime.create({
                    regimeName: regimeName,
                })
                if(newRegime)
                    return res.status(201).json({message: "Status inserido com sucesso."})
            }catch(err: any){
                return res.status(500).json({error: err.message})
            }

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getRegimes(req: Request, res: Response){
        try{
            const regimes = await Regime.findAll({include: [Atividade]})

            return res.status(200).json(regimes)
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}