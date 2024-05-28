import { Response, Request } from "express"
import SetorEmpresa from "../schemas/SetorEmpresaSchema"


export default class regimeController{
    static async createRegime(req: Request, res: Response){
        try{
            const idSetor: number = req.body.idSetor
            const idEmpresa: number = req.body.idEmpresa

            const setorEmpresa = SetorEmpresa.create({
                idSetor: idSetor,
                idEmpresa: idEmpresa
            })

            if(!setorEmpresa)
                return res.status(400).json({error: 'Verifique os dados informados.'})
            return res.status(201).json({message: 'Empresa/Setor anexados com sucesso.', setorEmpresa})
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getRegimes(req: Request, res: Response){
        try{
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}