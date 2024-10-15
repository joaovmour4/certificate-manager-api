import Obrigacao, { ObrigacaoAttributes } from "../schemas/ObrigacaoSchema";
import { NextFunction, Request, Response } from "express";
import Atividade from "../schemas/AtividadeSchema";
import { Model, ModelAttributes, Op } from "sequelize";
import RegimeObrigacao, { RegimeObrigacaoAttributes } from "../schemas/RegimeObrigacaoSchema";
import EmpresaAtividade from "../schemas/EmpresaAtividadeSchema";
import Regime from "../schemas/RegimeSchema";
import Competencia from "../schemas/CompetenciaSchema";
import Empresa from "../schemas/EmpresaSchema";
import ObrigacaoExcecao from "../schemas/ObrigacaoExcecaoSchema";

export default class ObrigacaoController{
    static async createObrigacao(req: Request, res: Response){
        try{
            const obrigacaoName: string = req.body.name
            const obrigacaoShortName: string = req.body.shortName
            const idSetor: number = req.body.idSetor
            const excecoes: Array<number> = JSON.parse(req.body.excecoes)
            const regimes: Array<number> = JSON.parse(req.body.regimes)

            if(!obrigacaoName)
                return res.status(400).json({error: 'Informe o nome da Obrigacao.'})
            const [newObrigacao, created] = await Obrigacao.findOrCreate({
                where:{
                    obrigacaoShortName: obrigacaoShortName
                },
                paranoid: false,
                defaults:{
                    obrigacaoName: obrigacaoName,
                    obrigacaoShortName: obrigacaoShortName,
                    idSetor: idSetor,
            }})

            for (const excecao of excecoes){
                await ObrigacaoExcecao.create({
                    idObrigacao: newObrigacao.dataValues.idObrigacao,
                    idExcecao: excecao
                })
            }

            if(!created){
                if(!newObrigacao.dataValues.deletedAt)
                    return res.status(400).json({message: 'Já existe uma obrigação cadastrada com o nome informado.'})
                await newObrigacao.restore()
                return res.status(201).json({message: 'Obrigacao restaurada com sucesso.', newObrigacao})
            }

            regimes.map(idRegime => {
                RegimeObrigacao.create({
                    ObrigacaoIdObrigacao: newObrigacao.dataValues.idObrigacao,
                    RegimeIdRegime: idRegime
                })
            })

            const empresas = await Empresa.findAll({where:{
                idRegime: regimes
            }})

            const actualDate = new Date()

            const competencias = await Competencia.findAll({
                where: {
                    mes: {[Op.gte]: actualDate.getMonth()+1},
                    ano: {[Op.gte]: actualDate.getFullYear()}
                }}
            )

            for(const competencia of competencias){
                const atividade = await Atividade.create({
                    idObrigacao: newObrigacao.dataValues.idObrigacao,
                    idCompetencia: competencia.dataValues.idCompetencia
                })
                for(const empresa of empresas){
                    if(excecoes.includes(1)) // ANUAL
                        console.log('ANUAL')
                    if(excecoes.includes(2) && empresa.dataValues.situacaoIE === 'SERVICO') // SERVICO
                        continue
                    if(excecoes.includes(3) && !empresa.dataValues.inscricaoEmpresa) // SEM IE
                        continue
                    await EmpresaAtividade.create({
                        idObrigacao: newObrigacao.dataValues.idObrigacao,
                        EmpresaIdEmpresa: empresa.dataValues.idEmpresa,
                        AtividadeIdAtividade: atividade.dataValues.idAtividade
                    })
                }
            }
            
            return res.status(201).json({message: 'Obrigacao inserida com sucesso.', newObrigacao})


        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async updateObrigacao(req: Request, res: Response){
        try{
            const idObrigacao = req.params.id
            const obrigacaoName: string = req.body.obrigacaoName
            const obrigacaoShortName: string = req.body.obrigacaoShortName
            const idSetor: number = req.body.idSetor
            const regimes: Array<number> = JSON.parse(req.body.regimes)

            const obrigacao = await Obrigacao.update({
                obrigacaoName: obrigacaoName,
                obrigacaoShortName: obrigacaoShortName,
                idSetor: idSetor
            }, {where: {
                idObrigacao: idObrigacao
            }})

            await RegimeObrigacao.destroy({
                where: {
                    ObrigacaoIdObrigacao: idObrigacao,
                    RegimeIdRegime: { [Op.notIn]: regimes }
                }
            });

            for (const idRegime of regimes) {
                await RegimeObrigacao.findOrCreate({
                    where: { 
                        ObrigacaoIdObrigacao: idObrigacao,
                        RegimeIdRegime: idRegime 
                    },
                    defaults: {
                        ObrigacaoIdObrigacao: idObrigacao,
                        RegimeIdRegime: idRegime
                    }
                });
            }
              

            if(!obrigacao[0])
                return res.status(400).json({message: 'Não foi possível alterar o registro.'})
            return res.status(200).json({message: 'Registro alterado com sucesso.'})

        }catch(err: unknown){
            return res.status(500).json({message: 'Erro desconhecido.'})
        }
    }
    static async getObrigacoes(req: Request, res: Response){
        try{
            const paranoid = req.params.paranoid === 'true' ? true : false 
            // Se paranoid, não retorna registros excluídos
            const filter = req.query.filter
            const search = req.query.search
            const idSetor = req.query.setor

            var whereCondition = {}
            if(filter !== 'all')
                whereCondition = {...whereCondition,
                    idRegime: Number(filter)
                }

            const obrigacoes = await Obrigacao.findAll({
                where: { 
                    idSetor: idSetor,
                    obrigacaoName: {
                        [Op.like]: `%${search}%`
                    }
                },
                paranoid: paranoid,
                include: {
                    model: Regime,
                    through: {attributes: []},
                    where: whereCondition
                }
            })
            return res.status(200).json(obrigacoes)

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async getObrigacoesCompetencia(req: Request, res: Response, next: NextFunction){
        try{
            const mes = req.query.mes
            const ano = req.query.ano
            const filter = req.query.filter
            const search = req.query.search
            const idSetor = req.query.setor

            const competencia = new Date(`${mes}-1-${ano}`)

            var whereCondition = {}
            if(filter !== 'all')
                whereCondition = {...whereCondition,
                    idRegime: Number(filter)
                }

            const obrigacoes = await Obrigacao.findAll({
                where: { 
                    idSetor: idSetor,
                    obrigacaoName: {
                        [Op.like]: `%${search}%`
                    },
                    [Op.or]: [
                        { deletedAt: { [Op.gte]: competencia } }, // Deletados após a data da competência
                        { deletedAt: null } // Ou registros que não foram deletados
                    ]
                },
                paranoid: false,
                include: {
                    model: Regime,
                    through: {attributes: []},
                    where: whereCondition
                }
            })
            return res.status(200).json(obrigacoes)

        }catch(err: any){
            next(err)
        }
    }
    static async getObrigacao(req: Request, res: Response){
        try{
            const idObrigacao = req.params.id
            const obrigacao = await Obrigacao.findByPk(idObrigacao,{
                include: {
                    model: Regime,
                    through: {attributes: []}
                }
            })
            return res.status(200).json(obrigacao)

        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
    static async deleteObrigacao(req: Request, res: Response){
        try{
            const idObrigacao: number = Number(req.params.id)

            if(!idObrigacao)
                return res.status(400).json({message: 'Informe um id de registro para remover.'})

            const obrigacao: Model<ObrigacaoAttributes> | null = await Obrigacao.findByPk(idObrigacao)
            if(!obrigacao)
                return res.status(404).json({message: 'Registro não encontrado.'})

            try{
                await obrigacao?.destroy()
                return res.status(200).json({message: 'Obrigacao removida com sucesso.'})
            }catch(err: any){
                return res.status(500).json({message: err.message})
            }
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
}