import { Request, Response } from "express";
import { Op, Model, where } from "sequelize";
import Empresa, { EmpresaAttributes } from "../schemas/EmpresaSchema";
import Regime from "../schemas/RegimeSchema";
import Usuario, { UsuarioAttributes } from "../schemas/userSchema";
import Atividade from "../schemas/AtividadeSchema";
import Obrigacao from "../schemas/ObrigacaoSchema";
import Competencia, { CompetenciaAttributes } from "../schemas/CompetenciaSchema";
import Setor from "../schemas/SetorSchema";
import EmpresaAtividade, { EmpresaAtividadeAttributes } from "../schemas/EmpresaAtividadeSchema";
import { Json } from "sequelize/types/utils";

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

            try{
                const newEmpresa = await Empresa.create({
                    nameEmpresa: nameEmpresa,
                    activeEmpresa: activeEmpresa,
                    codigoQuestor: codigoQuestor,
                    cnpjEmpresa: cnpjEmpresa,
                    inscricaoEmpresa: inscricaoEmpresa,
                    representante: representante,
                    idRegime: idRegime,
                    situacaoFinanceiro: {
                        date: new Date(),
                        active: true
                    }
                })

                const actualDate = new Date()

                const regimeAtividades = await Regime.findByPk(idRegime, {
                    include: {
                        model: Obrigacao,
                        through: {attributes: []},
                        include: [{
                            model: Competencia,
                            where: {
                                mes: {[Op.gte]: actualDate.getMonth()+1},
                                ano: {[Op.gte]: actualDate.getFullYear()}
                            }
                        }]
                    }
                })

                for(const obrigacao of regimeAtividades?.dataValues.Obrigacaos){
                    for(const competencia of obrigacao.Competencias){
                        const atividade = await EmpresaAtividade.create({
                            idObrigacao: obrigacao.idObrigacao,
                            EmpresaIdEmpresa: newEmpresa.dataValues.idEmpresa,
                            AtividadeIdAtividade: competencia.Atividades.idAtividade
                        })
                    }
                }
                
                return res.status(201).json({message: 'Registro inserido com sucesso.', regimeAtividades})
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
            let setorWhereCondition = {}

            let userFilter: {} | undefined = {}

            if(user.cargo !== 'admin' && user.cargo !== 'supervisor')
                userFilter = {idUsuario: idUsuario}
            else
                userFilter = undefined
            
            if(user.cargo !== 'admin')
                setorWhereCondition = {idSetor: user.idSetor}

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
    static async updateEmpresa(req: Request, res: Response){
        try{
            const idEmpresa: number = Number(req.params.id)
            if(!idEmpresa)
                return res.status(400).json({error: 'É necessário informar um id para a atualização.'})

            const data = {
                nameEmpresa: req.body.nameEmpresa,
                codigoQuestor: req.body.codigoQuestor,
                cnpjEmpresa: req.body.cnpjEmpresa,
                inscricaoEmpresa: req.body.inscricaoEmpresa,
                representante: req.body.representante,
                idRegime: req.body.idRegime
            }

            const updateEmpresa = await Empresa.update(data, {where: {
                idEmpresa: idEmpresa
            }})

            if(!updateEmpresa)
                return res.status(400)
            return res.status(200).json({message: 'Dados da empresa atualizados com sucesso.'})

        }catch(err: unknown){
            return res.status(500).json({error: err})
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
            const empresas = await Empresa.findAll({
                include: [
                    {
                        model: Regime
                    },
                    {
                        model: Setor,
                        through: {attributes: []}
                    }
                ]
            })

            return res.status(200).json(empresas)

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async lockEmpresa(req: Request, res: Response){
        try{
            if(res.user.Setor.setorName !== 'Financeiro')
                return res.status(401).json({message: 'Acesso negado. Somente o setor financeiro pode bloquear ou desbloquear empresas.'})

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
            if(res.user.Setor.setorName !== 'Financeiro')
                return res.status(401).json({message: 'Acesso negado. Somente o setor financeiro pode bloquear ou desbloquear empresas.'})

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