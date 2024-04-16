import { Response, Request, ErrorRequestHandler } from "express"
import {Email, IEmail} from '../schemas/emailSchema'

export default class emailController{
    static async newEmail(req: Request, res: Response){
        try{
            const name: string = req.body.name
            const email: string = req.body.email

            if(await Email.findOne({email: email}))
                return res.status(400).json({message: 'O E-Mail informado já existe na base de dados.'})

            const newEmail: IEmail = await Email.create({
                name:name,
                email:email
            })

            if(typeof newEmail === null)
                return res.status(400).json({message: 'Não foi possível inserir o documento.'})
            return res.status(201).json({message: 'E-Mail inserido com sucesso.'})
        }catch(err:unknown){
            throw new Error('Ocorreu um erro ao processar a requisição.')
        }
    }
    static async updateEmail(req: Request, res: Response){
        try{
            const name: string = req.body.name
            const id: string = req.params.id
            const newEmail: string = req.body.email

            const bdEmail: IEmail | null = await Email.findById(id)
            if(!bdEmail)
                return res.status(404).json({message: 'O E-Mail informado não existe na base de dados.'})

            const updateEmail = await Email.findByIdAndUpdate(id, {
                name: name ? name:bdEmail.name,
                email:newEmail ? newEmail:bdEmail.email
            }, {new:true})

            if(typeof updateEmail === null)
                return res.status(500).json({message: 'Não foi possível alterar o documento'})
            return res.status(200).json({message: 'Registro de E-Mail alterado com sucesso.'})

        }catch(err:unknown){
            throw new Error('Ocorreu um erro ao processar a requisição.')
        }
    }
    static async getEmails(req: Request, res: Response){
        try{
            const emails = await Email.find()
            if(!emails)
                return res.status(400).json({message: 'Não foi possível buscar os documentos.'})
            return res.status(200).json(emails)
        }catch(err:unknown){
            throw new Error('Ocorreu um erro ao processar a requisição.')
        }
    }
    static async deleteEmail(req: Request, res: Response){
        try{
            const id: string = req.params.id

            const deleteEmail = await Email.findByIdAndDelete(id)
            if(!deleteEmail)
                return res.status(400).json({message: 'Não foi possível remover o documento.'})
            return res.status(200).json(deleteEmail)
        }catch(err:unknown){
            throw new Error('Ocorreu um erro ao processar a requisição.')
        }
    }
}