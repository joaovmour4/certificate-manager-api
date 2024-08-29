import { NextFunction, Request, Response } from "express";
import { Op, Model, where } from "sequelize";
import Empresa, { EmpresaAttributes } from "../schemas/EmpresaSchema";
import Regime from "../schemas/RegimeSchema";
import Usuario, { UsuarioAttributes } from "../schemas/userSchema";
import Atividade from "../schemas/AtividadeSchema";
import Obrigacao from "../schemas/ObrigacaoSchema";
import Competencia, { CompetenciaAttributes } from "../schemas/CompetenciaSchema";
import Setor from "../schemas/SetorSchema";
import SetorEmpresa from "../schemas/SetorEmpresaSchema";

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
            const codigoQuestor: number = req.body.codigoQuestor
            const cnpjEmpresa: string = req.body.cnpjEmpresa
            const inscricaoEmpresa: string = req.body.inscricaoEmpresa
            const situacaoIE: string = req.body.situacaoIE
            const representante: string = req.body.representante
            const idRegime: number = req.body.idRegime

            try{
                const newEmpresa = await Empresa.create({
                    nameEmpresa: nameEmpresa,
                    activeEmpresa: true,
                    codigoQuestor: codigoQuestor,
                    cnpjEmpresa: cnpjEmpresa,
                    inscricaoEmpresa: inscricaoEmpresa.length ? inscricaoEmpresa : null,
                    situacaoIE: situacaoIE,
                    representante: representante,
                    idRegime: idRegime,
                    situacaoFinanceiro: {
                        date: new Date(),
                        active: true
                    }
                })

                await SetorEmpresa.create({
                    idSetor: 4,
                    idEmpresa: newEmpresa.dataValues.idEmpresa
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
    static async getEmpresas(req: Request, res: Response, next: NextFunction){
        try{
            const filter = req.params.filter
            const nameEmpresa = req.query.nameEmpresa
            const mes = Number(req.query.mes)
            const ano = Number(req.query.ano)
            const idUsuario = Number(req.query.user)
            const idSetor = Number(req.query.setor)
            const orderField = String(req.query.of) // Campo que receberá ordenação
            const order = req.query.o === 'true' ? 'ASC' : 'DESC' // Ordenação crescente ou decrescente, boolean
            const user: any = await Usuario.findByPk(idUsuario)

            const actualDate = new Date()
            let whereCondition = {}
            let setorWhereCondition = {}

            let userFilter: {} | undefined = {}

            if(user.cargo !== 'admin'){
                userFilter = {idUsuario: idUsuario}
            }
            else if(user.cargo !== 'supervisor'){
                userFilter = {idUsuario: idUsuario}
                setorWhereCondition = {idSetor: user.idSetor}
            }
            else{
                userFilter = undefined
                setorWhereCondition = {idSetor: idSetor}
            }

            if(filter !== 'all')
                whereCondition = {idRegime: Number(filter)}

            if(nameEmpresa)
                whereCondition = {...whereCondition, 
                nameEmpresa: {[Op.substring]: nameEmpresa}
            }

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
                        where: setorWhereCondition
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
                            {
                                model: Obrigacao,
                                paranoid: 
                                (actualDate.getMonth()+1 > mes || actualDate.getFullYear() > ano)
                            }
                        ],
                    }
                ],
                order: [
                    orderField === 'regimeName' ? [Regime, orderField, order] : [orderField, order]
                ]
            })

            return res.status(200).json({empresas})

        }catch(err){
            next(err)
        }
    }
    static async updateEmpresa(req: Request, res: Response, next: NextFunction){
        try{
            const idEmpresa: number = Number(req.params.id)
            if(!idEmpresa)
                return res.status(400).json({error: 'É necessário informar um id para a atualização.'})

            const data = {
                nameEmpresa: req.body.nameEmpresa,
                codigoQuestor: req.body.codigoQuestor,
                cnpjEmpresa: req.body.cnpjEmpresa,
                inscricaoEmpresa: req.body.inscricaoEmpresa?.length ? req.body.inscricaoEmpresa : null,
                situacaoIE: req.body.situacaoIE,
                representante: req.body.representante,
                idRegime: req.body.idRegime
            }

            const updateEmpresa = await Empresa.update(data, {where: {
                idEmpresa: idEmpresa
            }})

            if(!updateEmpresa)
                return res.status(400).json({message: 'Não foi possível alterar os dados da empresa.'})
            return res.status(200).json({message: 'Dados da empresa atualizados com sucesso.'})

        }catch(err){
            next(err)
        }
    }
    static async deleteEmpresa(req: Request, res: Response){
        try{
            const idEmpresa: number = Number(req.params.id)
            if(!idEmpresa)
                return res.status(400).json({error: 'É necessário informar um id para a remoção.'})

            const removeEmpresa = await Empresa.destroy({where: {idEmpresa: idEmpresa}})

            if(!removeEmpresa)
                return res.status(400).json({message: 'Não foi possível remover o registro'})
            return res.status(200).json({message: 'Registro removido com sucesso.', removeEmpresa})

        }catch(err: unknown){
            return res.status(500).json({error: err})
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

            return res.status(200).json(empresa)

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async getAllEmpresa(req: Request, res: Response){
        try{
            const search = req.query.search
            const filter = req.query.filter
            const orderField = String(req.query.of) // Campo que será ordenado
            const order = req.query.o === 'true' ? 'ASC' : 'DESC' // Ordenação ascending ou descending
            var whereCondition = {}

            if(filter !== 'all')
                whereCondition = {
                    idRegime: Number(filter)
                }

            const empresas = await Empresa.findAll({
                where: {
                    nameEmpresa: {[Op.like]: `%${search}%`}
                },
                include: [
                    {
                        model: Regime,
                        where: whereCondition
                    },
                    {
                        model: Setor,
                        through: {attributes: []}
                    }
                ],
                order: [
                    orderField === 'regimeName' ? [Regime, orderField, order] : [orderField, order]
                ]
            })

            return res.status(200).json(empresas)

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async lockEmpresa(req: Request, res: Response){
        try{
            if(res.user.Setor?.setorName !== 'Financeiro' && res.user.cargo !== 'admin')
                return res.status(403).json({message: 'Acesso negado. Somente o setor financeiro pode bloquear ou desbloquear empresas.'})

            const idEmpresa = req.params.id

            const empresa: Model<EmpresaAttributes> | null = await Empresa.findByPk(idEmpresa)
            if(!empresa)
                return res.status(404).json({message: 'Registro não encontrado.'})

            const situacaoFinanceiro: any = empresa.dataValues.situacaoFinanceiro

            const updateEmpresa = await Empresa.update({
                situacaoFinanceiro: {
                    active: !situacaoFinanceiro.active,
                    date: new Date()
                }
            },{
                where: {idEmpresa: idEmpresa}
            })
            if(updateEmpresa[0] === 0)
                return res.status(400).json({message: 'Houve um erro.'})
            return res.status(200).json({
                message: 'Empresa bloqueada com sucesso.', 
                empresaBloqueada: idEmpresa, 
                countEmpresas: updateEmpresa[0]
            })

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async unlockEmpresa(req: Request, res: Response){
        try{
            if(res.user.Setor?.setorName !== 'Financeiro' && res.user.cargo !== 'admin')
                return res.status(403).json({message: 'Acesso negado. Somente o setor financeiro pode bloquear ou desbloquear empresas.'})

            const idEmpresa = req.params.id

            const empresa: Model<EmpresaAttributes> | null = await Empresa.findByPk(idEmpresa)
            if(!empresa)
                return res.status(404).json({message: 'Registro não encontrado.'})


            const updateEmpresa = await Empresa.update({
                situacaoFinanceiro: {
                    active: true,
                    date: new Date()
                }
            },{
                where: {idEmpresa: idEmpresa}
            })
            if(updateEmpresa[0] === 0)
                return res.status(400).json({message: 'Houve um erro.'})
            return res.status(200).json({
                message: 'Empresa desbloqueada com sucesso.', 
                empresaBloqueada: idEmpresa, 
                countEmpresas: updateEmpresa[0]
            })

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
}