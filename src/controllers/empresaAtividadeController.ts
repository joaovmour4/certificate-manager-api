import { Request, Response } from "express";
import EmpresaAtividade from "../schemas/EmpresaAtividadeSchema";

export default class EmpresaAtividadeController{
    static async getEmpresaAtividades(req: Request, res: Response){
        try{
            const empresaAtividades = await EmpresaAtividade.findAll()
            return res.status(200).json(empresaAtividades)
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }   
}