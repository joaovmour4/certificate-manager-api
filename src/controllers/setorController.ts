import { Response, Request } from "express"
import Setor from "../schemas/SetorSchema"


export default class setorController{
    static async createSetor(req: Request, res: Response){
        try{
            const setorName: string = req.body.name

            try{
                const newSetor = await Setor.create({
                    setorName: setorName,
                })
                if(newSetor)
                    return res.status(201).json({message: "Setor criado com sucesso."})
            }catch(err: any){
                return res.status(500).json({error: err.message})
            }

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getSetores(req: Request, res: Response){
        try{
            const setores = await Setor.findAll()

            return res.status(200).json(setores)
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}