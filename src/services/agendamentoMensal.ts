import { Model } from "sequelize"
import Competencia from "../schemas/CompetenciaSchema"
import Empresa from "../schemas/EmpresaSchema"
import Obrigacao, { ObrigacaoAttributes } from "../schemas/ObrigacaoSchema"
import Regime from "../schemas/RegimeSchema"
import Atividade, { AtividadeAttributes } from "../schemas/AtividadeSchema"
import EmpresaAtividade from "../schemas/EmpresaAtividadeSchema"
import excecaoController from "../controllers/excecaoController"

export default class Agendamentos{
    static async createCompetenciasMensais(){
        try{
            const mes = new Date().getMonth()+2 //////////////////
            const ano = new Date().getFullYear()

            const find = await Competencia.findOne({where: {
                mes: mes,
                ano: ano
            }})
            if(find)
                return {status: false, log: 'A competência já existe.'}

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
                    const verifyExcecoes = await excecaoController.verifyExcecoes(obrigacao.idObrigacao, empresa.idEmpresa)
                    if(verifyExcecoes)
                        continue
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
                return {status: false, log: 'Erro nos dados fornecidos.'}
            return {status: true, log: 'Competência criada com sucesso.'}
       
        }catch(err: any){
            return {status: false, log: err.message}
        }
    }
    static async setActiveMensal(){
        try{
            const updateEmpresas = await Empresa.update(
                {activeEmpresa: true},
                {where: {activeEmpresa: false}}
            )

            if(!updateEmpresas)
                return {result: false, log: 'Não foi possível ativar as empresas.'}
            return {result: true, log: 'Empresas ativas com sucesso.'}

        }catch(err: any){
            return {result: false, log: err.message}
        }
    }
}