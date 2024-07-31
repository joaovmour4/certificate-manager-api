import { Response, Request } from "express"
import SetorEmpresa from "../schemas/SetorEmpresaSchema"
import EmpresaAtividade from "../schemas/EmpresaAtividadeSchema"
import Regime from "../schemas/RegimeSchema"
import Obrigacao from "../schemas/ObrigacaoSchema"
import Competencia from "../schemas/CompetenciaSchema"
import { Op } from "sequelize"
import Empresa from "../schemas/EmpresaSchema"
import Excecao, { ExcecaoAttributes } from "../schemas/ExcecaoSchema"
import excecaoController from "./excecaoController"


export default class setorEmpresaController{
    static async atribuirSetorEmpresa(req: Request, res: Response){
        try{
            const idSetor: number = req.body.idSetor
            const idEmpresa: number = req.body.idEmpresa

            const verify = await SetorEmpresa.findAll({where:{
                idSetor: idSetor,
                idEmpresa: idEmpresa
            }})

            if(res.user.cargo !== 'admin' && res.user.idSetor !== idSetor)
                return res.status(403).json({message: 'Somente usuários do próprio setor podem alterar suas atribuições.'})
            if(verify.length)
                return res.status(400).json({message: 'O registro já existe na base de dados.'})

            const setorEmpresa = SetorEmpresa.create({
                idSetor: idSetor,
                idEmpresa: idEmpresa
            })

            if(!setorEmpresa)
                return res.status(400).json({message: 'Verifique os dados informados.'})

            const actualDate = new Date()

            const empresa = await Empresa.findByPk(idEmpresa)

            const regimeAtividades = await Regime.findByPk(empresa?.dataValues.idRegime, {
                include: {
                    model: Obrigacao,
                    through: {attributes: []},
                    include: [
                        {
                            model: Competencia,
                            where: {
                                mes: {[Op.gte]: actualDate.getMonth()+1},
                                ano: {[Op.gte]: actualDate.getFullYear()}
                            }
                        },
                        {
                            model: Excecao,
                            through: {attributes: []}
                        }
                    ]
                }
            })

            for(const obrigacao of regimeAtividades?.dataValues.Obrigacaos){
                for(const competencia of obrigacao.Competencias){
                    const verifyExcecoes = await excecaoController.verifyExcecoes(obrigacao.idObrigacao, empresa?.dataValues.idEmpresa)
                    if(verifyExcecoes)
                        continue
                    
                    await EmpresaAtividade.findOrCreate({
                        where:{
                            idObrigacao: obrigacao.idObrigacao,
                            EmpresaIdEmpresa: idEmpresa,
                            AtividadeIdAtividade: competencia.Atividades.idAtividade
                        },
                        defaults:{
                            idObrigacao: obrigacao.idObrigacao,
                            EmpresaIdEmpresa: idEmpresa,
                            AtividadeIdAtividade: competencia.Atividades.idAtividade
                        }
                    })
                }
            }

            return res.status(201).json({message: 'Empresa/Setor anexados com sucesso.'})
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async removeAtribuicaoSetorEmpresa(req: Request, res: Response){
        try{
            const idSetor: number = req.body.idSetor
            const idEmpresa: number = req.body.idEmpresa

            if(res.user.cargo !== 'admin' && res.user.idSetor !== idSetor)
                return res.status(403).json({message: 'Somente usuários do próprio setor ou Administradores podem alterar suas atribuições.'})
            
            const deleteAtribuicao = await SetorEmpresa.destroy({where:{
                idSetor: idSetor,
                idEmpresa: idEmpresa
            }})

            if(!deleteAtribuicao)
                return res.status(400).json({message: 'Não foi possível remover a atribuição.'})
            return res.status(200).json({message: 'Atribuição removida com sucesso.'})

        }catch(err: unknown){
            return res.status(500).json({message: err})
        }
    }
}