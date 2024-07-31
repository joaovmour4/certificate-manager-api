import { NextFunction, Request, Response } from "express";
import Excecao, { ExcecaoAttributes } from "../schemas/ExcecaoSchema";
import ObrigacaoExcecao from "../schemas/ObrigacaoExcecaoSchema";
import Obrigacao, { ObrigacaoAttributes } from "../schemas/ObrigacaoSchema";
import { Model } from "sequelize";
import Empresa from "../schemas/EmpresaSchema";

export default class excecaoController{
    static async getAll(req: Request, res: Response, next: NextFunction){
        try{
            const excecoes = await Excecao.findAll()
            return res.status(200).json(excecoes)
        }catch(err){
            next(err)
        }
    }
    static async getObrigacoesExcecoes(req: Request, res: Response, next: NextFunction){
        try{
            const obrigacoes = await Obrigacao.findAll({
                include: {
                    model: Excecao,
                    through: {attributes: []}
                }
            })
            return res.status(200).json(obrigacoes)
        }catch(err){
            next(err)
        }
    }
    static async atribuirExcecao(req: Request, res: Response, next: NextFunction){
        try{
            const idObrigacao: number = req.body.idObrigacao
            const idExcecao: number = req.body.idExcecao

            const excecao = await ObrigacaoExcecao.findOrCreate({
                    where: {
                        idObrigacao: idObrigacao,
                        idExcecao: idExcecao
                    },
                    defaults: {
                        idObrigacao: idObrigacao,
                        idExcecao: idExcecao
                    }
                }
            )

            if(!excecao)
                return res.status(400).json({message: 'Não foi possível inserir o registro.'})
            return res.status(201).json({message: 'Registro inserido com sucesso.'})

        }catch(err){
            next(err)
        }
    }
    static async removerAtribuicaoExcecao(req: Request, res: Response, next: NextFunction){
        try{
            const idObrigacao = Number(req.query.obrigacao)
            const idExcecao = Number(req.query.excecao)

            const remove = await ObrigacaoExcecao.destroy({
                    where: {
                        idObrigacao: idObrigacao,
                        idExcecao: idExcecao
                    }
                }
            )

            if(!remove)
                return res.status(400).json({message: 'Não foi possível remover o registro.'})
            return res.status(201).json({message: 'Registro removido com sucesso.'})

        }catch(err){
            next(err)
        }
    }
    static async verifyExcecoes(idObrigacao: number, idEmpresa: number){
        try{
            const obrigacao = await Obrigacao.findByPk(idObrigacao, {
                include: {
                    model: Excecao,
                    through: {attributes: []}
                }
            })
            const empresa = await Empresa.findByPk(idEmpresa)

            if(obrigacao?.dataValues.Excecoes.find((element: ExcecaoAttributes) => element.excecaoName === 'SEM IE') && 
                !empresa?.dataValues.inscricaoEmpresa
            ){
                return true // Significa que a obrigação é excecao para a empresa, ou seja, não é executada
            }
            if(obrigacao?.dataValues.Excecoes.find((element: ExcecaoAttributes) => element.excecaoName === 'SERVICO') && 
                empresa?.dataValues.situacaoIE === 'SERVICO'
            ){
                return true // Significa que a obrigação é excecao para a empresa, ou seja, não é executada
            }


            return false

        }catch(err){
            return err
        }
    }
}