import { Response, Request } from "express"
import Competencia from "../schemas/CompetenciaSchema"
import Obrigacao, { ObrigacaoAttributes } from "../schemas/ObrigacaoSchema"
import Atividade, { AtividadeAttributes } from "../schemas/AtividadeSchema"
import Regime from "../schemas/RegimeSchema"
import Empresa from "../schemas/EmpresaSchema"
import EmpresaAtividade from "../schemas/EmpresaAtividadeSchema"
import { Model } from "sequelize"


export default class competenciaController{
    static async createCompetencia(req: Request, res: Response){
        try{
            const mes = req.body.mes
            const ano = req.body.ano

            const find = await Competencia.findOne({where: {
                mes: mes,
                ano: ano
            }})
            if(find)
                return res.status(400).json({error: 'O registro já existe.'})

            const competencia: any = await Competencia.create({
                mes: mes,
                ano: ano
            })
            const empresas: any = await Empresa.findAll({
                include: {
                    model: Regime,
                    include: [{
                        model: Obrigacao,
                        through: {attributes: []}
                    }]
                }
            })
            const obrigacoes: Array<Model<ObrigacaoAttributes>> = await Obrigacao.findAll()

            const activities = []
            for(const obrigacao of obrigacoes){
                const atividade: Model<AtividadeAttributes> = await Atividade.create({
                    idObrigacao: obrigacao.dataValues.idObrigacao,
                    idCompetencia: competencia.idCompetencia
                })
                activities.push(atividade)
            }

            for(const empresa of empresas){
                for(const obrigacao of empresa.Regime.Obrigacaos){
                    await EmpresaAtividade.create({
                        idObrigacao: obrigacao.idObrigacao,
                        EmpresaIdEmpresa: empresa.idEmpresa,
                        AtividadeIdAtividade: activities.find((activity)=> 
                            activity.dataValues.idObrigacao === obrigacao.idObrigacao
                        )?.dataValues.idAtividade
                    })
                }
            }

            if(!competencia)
                return res.status(400).json({error: 'Verifique os dados fornecidos.'})
            return res.status(201).json({message: 'Competência criada com sucesso.', competencia, Atividades: activities})
       
        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getCompetencias(req: Request, res: Response){
        try{
            const competencias = await Competencia.findAll()
            return res.status(200).json(competencias)
        }catch(err: any){
            return res.status(500).json({error: err.message})
        }
    }
}