import { Response, Request } from "express"
import Setor from "../schemas/SetorSchema"
import Empresa from "../schemas/EmpresaSchema"
import { Op } from "sequelize"
import Regime from "../schemas/RegimeSchema"


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
    static async getEmpresasPerSetor(req: Request, res: Response){
        try{
            const setor = req.params.setor
            const search = req.query.search

            const empresas = await Empresa.findAll({
                where: {
                    nameEmpresa: {[Op.like]: `%${search}%`}
                },
                include: [
                    {
                        model: Regime,
                    },
                    {
                        model: Setor,
                        through: {attributes: []},
                        where: {
                            idSetor: setor
                        },
                        required: true
                    }
                ],
            })

            return res.status(200).json(empresas)

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}