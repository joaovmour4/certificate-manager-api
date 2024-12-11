import { Response, Request, NextFunction } from "express"
import Usuario, { UsuarioAttributes } from "../schemas/userSchema"
import EmpresaAtividade from "../schemas/EmpresaAtividadeSchema"
import auth from "../services/auth"
import PasswordCrypt from "../services/passwordCrypt"
import Setor from "../schemas/SetorSchema"
import { Op } from "sequelize"
import { logAtividade } from "../services/logs"
import Obrigacao from "../schemas/ObrigacaoSchema"
import Competencia from "../schemas/CompetenciaSchema"
import Empresa from "../schemas/EmpresaSchema"
import Atividade from "../schemas/AtividadeSchema"

interface User{
    idUsuario: number
    username: string
    email: string
    login: string
    password: string
    idSetor: number
    cargo: string
}
interface Data{
    username: string,
    email: string,
    login: string,
    password?: string
    cargo: string
}

export { User }
export default class usuarioController{
    static async createUsuario(req: Request, res: Response){
        try{
            const username: string = req.body.username
            const email: string = req.body.email
            const login: string = req.body.login
            const password: string = req.body.password
            const idSetor: number = res.user.cargo === 'admin' ? req.body.idSetor : res.user.idSetor
            const cargo: string = req.body.cargo

            const passwordHash: any = await PasswordCrypt.encrypt(password)

            let newUser: any
            try{
                newUser = await Usuario.create({
                    username: username,
                    email: email,
                    login: login,
                    password: passwordHash.success && passwordHash.hash,
                    idSetor: idSetor,
                    cargo: cargo
                })
            }catch(err: any){
                if(err?.errors[0].type === 'unique violation'){
                    if(err.errors[0].path === 'login')
                        return res.status(422).json({message: 'Já existe um usuário com esse login.'})
                    else
                        return res.status(422).json({message: 'Já existe um usuário com esse E-Mail.'})
                }
                return res.status(500).json({
                    error: 'Ocorreu um erro na comunicação com o Banco de Dados. Contate o Administrador do sistema'
                })
            }

            if(!newUser)
                return res.status(400).json({message: 'Dados inválidos para criação do registro.'})
            return res.status(201).json({message: 'Usuário criado com sucesso.'})

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getUsers(req: Request, res: Response){
        try{
            const search = req.query.search
            var whereCondition = {}

            whereCondition = {
                username: {
                    [Op.like]: `%${search}%`
                }
            }

            if(res.user.cargo !== 'admin')
                whereCondition = {
                    ...whereCondition,
                    idSetor: res.user.idSetor
                }
            else if(req.query.setor !== 'all')
                whereCondition = {
                    ...whereCondition,
                    idSetor: Number(req.query.setor)
                }
            const users = await Usuario.findAll({
                where: whereCondition,
                include: Setor
            })

            return res.status(200).json(users)

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getUserById(req: Request, res: Response){
        try{
            const idUsuario: number = Number(req.params.id)

            const user = await Usuario.findByPk(idUsuario, {
                include: {
                    model: Setor
                }
            })

            return res.status(200).json(user)

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async updateUsuarioById(req: Request, res: Response){
        try{
            const idUsuario: string = req.params.id

            const username: string = req.body.username
            const email: string = req.body.email
            const login: string = req.body.login
            const password: string = req.body.password
            const cargo: string = req.body.cargo

            let data: Data = {
                username: username,
                email: email,
                login: login,
                cargo: cargo
            }
            if(password){
                const passwordHash: any = await PasswordCrypt.encrypt(password)
                data = {
                    ...data,
                    password: passwordHash.success && passwordHash.hash,
                }
            }

            let user: UsuarioAttributes | unknown
            try{
                user = await Usuario.update(data, {
                    where: {idUsuario: Number(idUsuario)}
                })

                return res.status(200).json({message: 'Usuário alterado com sucesso.'})
            }catch(err: any){
                if(err.errors[0].type === 'unique violation'){
                    if(err.errors[0].path === 'login')
                        return res.status(422).json({message: 'Já existe um usuário com esse login.'})
                    else
                        return res.status(422).json({message: 'Já existe um usuário com esse E-Mail.'})
                }
            }

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async deleteUser(req: Request, res: Response){
        try{
            const idUsuario = Number(req.params.id)

            const user = await Usuario.findByPk(idUsuario)
            
            if(user){
                try{
                    await user.destroy()
                    return res.status(200).json({message: 'Usuário removido com sucesso.'})
                }catch(err: any){
                    return res.status(500).json({message: 'Houve um erro ao remover o Usuário.'})
                }
            }
            return res.status(404).json({message: 'O Usuário informado não foi encontrado na base de dados.'})

        }catch(err: any){
            return res.status(500).json({error: err.mesage})
        }
    }

    // Atividades
    static async realizaAtividade(req: Request, res: Response){
        try{
            const idEmpresa = req.body.idEmpresa
            const idAtividade = req.body.idAtividade
            const idCompetencia = req.body.idCompetencia
            const idUsuario = req.body.idUsuario
            const statusAtividade = req.body.statusAtividade

            const atividade = await EmpresaAtividade.findOne({where: {
                EmpresaidEmpresa: idEmpresa,
                AtividadeIdAtividade: idAtividade
            }})

            if(!atividade)
                return res.status(404).json({error: 'A Empresa não realiza esta atividade.'})

            const updateAtividade = await atividade?.update({
                dataRealizacao: new Date(),
                idUsuario: idUsuario,
                status: statusAtividade
            })

            
            const obrigacao = await Obrigacao.findByPk(atividade.dataValues.idObrigacao)
            const findAtividade = await Atividade.findByPk(idAtividade)
            const competencia = await Competencia.findByPk(findAtividade?.dataValues.idCompetencia)
            const empresa = await Empresa.findByPk(idEmpresa)
            await logAtividade(res.user.username, true, obrigacao?.dataValues.obrigacaoName, `${competencia?.dataValues.mes}/${competencia?.dataValues.ano}`, empresa?.dataValues.nameEmpresa)

            if(obrigacao?.dataValues.obrigacaoName === 'DEI' && statusAtividade === 'SM'){
                const atividade = await Atividade.findOne({
                    where: {
                        idObrigacao: 2,
                        idCompetencia: idCompetencia
                    },
                    include:[ 
                        {
                            model: Empresa,
                            where: {
                                idEmpresa: idEmpresa
                            }
                        }
                    ]
                })
                const empresaAtividade = await EmpresaAtividade.findOne({
                    where: {
                        idEmpresaAtividade: atividade?.dataValues.Empresas[0].EmpresaAtividade.idEmpresaAtividade
                    }
                })

                await empresaAtividade?.update({
                    dataRealizacao: new Date(),
                    idUsuario: idUsuario,
                    status: statusAtividade
                })
            }
            
            return res.status(200).json({message: 'Atividade finalizada com sucesso.', updateAtividade})
        }catch(err: any){
            return res.status(500).json({error: err.mesage})
        }
    }
    static async desmarcaAtividade(req: Request, res: Response){
        try{
            const idEmpresa = req.body.idEmpresa
            const idAtividade = req.body.idAtividade

            const atividade = await EmpresaAtividade.findOne({where: {
                EmpresaidEmpresa: idEmpresa,
                AtividadeIdAtividade: idAtividade
            }})

            if(!atividade)
                return res.status(404).json({error: 'A Empresa não realiza esta atividade.'})

            const updateAtividade = await atividade?.update({
                dataRealizacao: null,
                status: null
            })

            const obrigacao = await Obrigacao.findByPk(atividade.dataValues.idObrigacao)
            const findAtividade = await Atividade.findByPk(idAtividade)
            const competencia = await Competencia.findByPk(findAtividade?.dataValues.idCompetencia)
            const empresa = await Empresa.findByPk(idEmpresa)
            await logAtividade(res.user.username, false, obrigacao?.dataValues.obrigacaoName, `${competencia?.dataValues.mes}/${competencia?.dataValues.ano}`, empresa?.dataValues.nameEmpresa)

            return res.status(200).json({message: 'Atividade movida com sucesso para pendentes.', updateAtividade})
        }catch(err: any){
            return res.status(500).json({error: err.mesage})
        }
    }

    // Autenticação
    static async login(req: Request, res: Response, next: NextFunction){
        try{
            const login: string = req.body.login
            const password: string = req.body.password

            const user: any = await Usuario.scope('withPassword').findOne({
                where: {login: login},
                include: Setor
            })
            if(!user)
                return res.status(404).json({message: 'Usuário não encontrado.'})
            const passwordVerify = await PasswordCrypt.compare(password, user.password)
            if(!passwordVerify)
                return res.status(400).json({message: 'Usuário ou senha incorretos.'})

            delete user.dataValues.password
            const authentication = await auth(user)

            if(!authentication.auth)
                return res.status(400).json({message: 'Ocorreu um erro na autenticação'})
            return res.status(200).json({
                message: 'Usuário autenticado com sucesso',
                authentication
            })
        }catch(err: any){
            next(err)
        }
    }
}
