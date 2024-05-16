import { Response, Request, ErrorRequestHandler } from "express"
import Usuario, { UsuarioAttributes } from "../schemas/userSchema"
import dotenv from 'dotenv'
import Empresa from "../schemas/EmpresaSchema"
dotenv.config()


export default class usuarioController{
    static async createUsuario(req: Request, res: Response){
        try{
            const username: string = req.body.username
            const email: string = req.body.email
            const login: string = req.body.login
            const password: string = req.body.password

            let newUser: any
            try{
                newUser = await Usuario.create({
                    username: username,
                    email: email,
                    login: login,
                    password: password
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
            const users = await Usuario.findAll({include: [Empresa]})

            return res.status(200).json(users)

        }catch(err: any){
            return res.status(500).json({message: err.message})
        }
    }
    static async getUserById(req: Request, res: Response){
        try{
            const idUsuario: number = Number(req.params.id)

            const user = await Usuario.findByPk(idUsuario)

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

            let user: UsuarioAttributes | unknown
            try{
                user = await Usuario.update({
                    username: username,
                    email: email,
                    login: login,
                    password: password
                }, {
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
}