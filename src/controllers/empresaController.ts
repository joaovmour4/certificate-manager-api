import { Request, Response } from "express";
import Empresa from "../schemas/EmpresaSchema";
import Regime from "../schemas/RegimeSchema";
import Usuario from "../schemas/userSchema";
import Atividade from "../schemas/AtividadeSchema";
import Obrigacao from "../schemas/ObrigacaoSchema";
import Competencia from "../schemas/CompetenciaSchema";

export default class empresaController{
    static async createEmpresa(req: Request, res: Response){
        try{
            const nameEmpresa: string = req.body.name
            const activeEmpresa: boolean = req.body.active
            const codigoQuestor: number = req.body.codigoQuestor
            const cnpjEmpresa: string = req.body.cnpjEmpresa
            const inscricaoEmpresa: string = req.body.inscricaoEmpresa
            const representante: string = req.body.representante
            const idRegime: number = req.body.idRegime

            let newEmpresa: any
            try{
                newEmpresa = await Empresa.create({
                    nameEmpresa: nameEmpresa,
                    activeEmpresa: activeEmpresa,
                    codigoQuestor: codigoQuestor,
                    cnpjEmpresa: cnpjEmpresa,
                    inscricaoEmpresa: inscricaoEmpresa,
                    representante: representante,
                    idRegime: idRegime
                })

                return res.status(201).json({message: 'Registro inserido com sucesso.'})
            }catch(err: any){
                return res.status(400).json({
                    message: 'Não foi possível inserir o registro no banco, verifique os dados fornecidos.',
                    error: err.message
                })
            }
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async getEmpresas(req: Request, res: Response){
        try{
            const mes = Number(req.query.mes)
            const ano = Number(req.query.ano)

            const empresas = await Empresa.findAll({
                include: [
                    {
                        model: Usuario,
                        through: {attributes: []},
                    },
                    {
                        model: Regime,
                        include: [{
                            model: Obrigacao,
                            through: {attributes: []}
                        }]
                    },
                    {
                        model: Atividade,
                        through: {attributes: ['dataRealizacao']},
                        include: [
                            {
                                model: Competencia,
                                where: {
                                    mes: mes,
                                    ano: ano
                                }
                            },
                            Obrigacao
                        ],
                    }
                ]
            })

            return res.status(200).json({empresas})

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async setActiveEmpresa(req: Request, res: Response){
        try{
            const idEmpresa: number = Number(req.params.id)
            const newStatus: boolean = req.body.newStatus

            const updateEmpresa = await Empresa.update(
                {activeEmpresa: newStatus},
                {where: { idEmpresa: idEmpresa }}
            )

            if(!updateEmpresa)
                return res.status(404).json({error: 'Empresa não encontrada.'})
            return res.status(200).json({message: 'Status alterado com sucesso.', updateEmpresa})

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async getEmpresa(req: Request, res: Response){
        try{
            const idEmpresa = Number(req.params.id)
            const empresa = await Empresa.findByPk(idEmpresa, {
                include: [
                    {
                        model: Atividade,
                        through: {attributes: ['dataRealizacao']},
                        include: [Competencia, Obrigacao]
                    }
                ]
            })

            return res.status(200).json({empresa})

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}