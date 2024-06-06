import { Request, Response } from "express";
import { Op, Model } from "sequelize";
import Empresa from "../schemas/EmpresaSchema";
import Regime from "../schemas/RegimeSchema";
import Usuario, { UsuarioAttributes } from "../schemas/userSchema";
import Atividade from "../schemas/AtividadeSchema";
import Obrigacao from "../schemas/ObrigacaoSchema";
import Competencia from "../schemas/CompetenciaSchema";
import Setor from "../schemas/SetorSchema";

interface whereCondition{
    nameEmpresa: string
    idRegime?: string | number
}
interface Usuario{
    idUsuario: number
    username: string
    email: string
    login: string
    password: string
    cargo: string
    idSetor: number
}

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
            const filter = req.params.filter
            const nameEmpresa = req.query.nameEmpresa
            const mes = Number(req.query.mes)
            const ano = Number(req.query.ano)
            const idUsuario = Number(req.query.user)
            const user: any = await Usuario.findByPk(idUsuario)

            let whereCondition = {}

            let userFilter: {} | undefined = {}

            if(user.cargo !== 'admin' && user.cargo !== 'supervisor')
                userFilter = {idUsuario: idUsuario}
            else
                userFilter = undefined
            
            if(filter !== 'all')
                whereCondition = {idRegime: Number(filter)}

            if(nameEmpresa)
                whereCondition = {...whereCondition, 
                nameEmpresa: {[Op.substring]: nameEmpresa}
            }
            console.log(userFilter)

            const empresas = await Empresa.findAll({where: whereCondition,
                include: [
                    {
                        model: Usuario,
                        as: 'responsavel',
                        where: userFilter
                    },
                    {
                        model: Usuario,
                        through: {attributes: []},
                    },
                    {
                        model: Setor,
                        through: {attributes: []},
                        where: {
                            idSetor: user.idSetor
                        }
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
    static async setUsuarioResponsavel(req: Request, res: Response){
        try{
            const idEmpresa: number = req.body.idEmpresa
            const idUsuario: number = req.body.idUsuario

            const updateEmpresa = await Empresa.update(
                {idUsuarioResponsavel: idUsuario},
                {where: { idEmpresa: idEmpresa }}
            )

            if(!updateEmpresa)
                return res.status(400).json({error: 'Não foi possivel realizar a alteração.'})
            return res.status(200).json({message: 'Usuário responsável atribuido com sucesso.', updateEmpresa})

            
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