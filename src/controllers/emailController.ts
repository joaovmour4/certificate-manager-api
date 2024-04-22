import { Response, Request, ErrorRequestHandler } from "express"
import { Certificate, ICertificate } from "../schemas/certificateSchema"
import {Email, IEmail} from '../schemas/emailSchema'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

interface returnEmail{
    accepted: Array<string>
    rejected: Array<string>
    messageId: string
}

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

            if(!newEmail)
                return res.status(400).json({message: 'Não foi possível inserir o documento.'})
            return res.status(201).json({message: 'E-Mail inserido com sucesso.'})
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({message: 'Ocorreu um erro ao processar a requisição.'})
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

            if(!updateEmail)
                return res.status(404).json({message: 'Não foi possível alterar o documento'})
            return res.status(200).json({message: 'Registro de E-Mail alterado com sucesso.'})

        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({message: 'Ocorreu um erro ao processar a requisição.'})
        }
    }
    static async getEmails(req: Request, res: Response){
        try{
            const emails = await Email.find()
            if(!emails)
                return res.status(404).json({message: 'Não foi possível buscar os documentos.'})
            return res.status(200).json(emails)
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({message: 'Ocorreu um erro ao processar a requisição.'})
        }
    }
    static async getEmail(req: Request, res: Response){
        try{
            const id: string = req.params.id
            const email = await Email.findById(id)
            if(!email)
                return res.status(404).json({message: 'O E-Mail solicitado não foi encontrado na base de dados.'})
            return res.status(200).json(email)
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({message: 'Ocorreu um erro ao processar a requisição.'})
        }
    }
    static async findEmail(req: Request, res: Response){
        try{
            const name: string = req.params.name
            const email = await Email.find({name: {$regex: name, $options: 'i'}})
            
            if(!email)
                return res.status(404).json({message: 'O E-Mail solicitado não foi encontrado na base de dados.'})
            return res.status(200).json(email)
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({message: 'Ocorreu um erro ao processar a requisição.'})
        }
    }
    static async deleteEmail(req: Request, res: Response){
        try{
            const id: string = req.params.id

            const deleteEmail = await Email.findByIdAndDelete(id)
            if(!deleteEmail)
                return res.status(404).json({message: 'Não foi possível remover o documento.'})
            return res.status(200).json({message: 'Registro excluído com sucesso.', deleteEmail})
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({message: 'Ocorreu um erro ao processar a requisição.'})
        }
    }

    static async sendEmail(req: Request, res: Response){
        try{
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth:{
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            })

            const actualDate = new Date()
            const thirtyDays = new Date(actualDate)
            thirtyDays.setDate(actualDate.getDate()+30)

            
            const expiredCertificates = await Certificate.find({valid: {$lt: actualDate}}).sort('owner')
            const certificates = await Certificate.find({valid: {$gte: actualDate, $lte:thirtyDays}})
            const emailList = (await Email.find()).map(email => {return email.email})
            
            if(certificates.length === 0)
                return res.status(202).json({message: 'Não há certificados com vencimento próximo.'})

            let expiredCertificateString = ''
            expiredCertificates.map((certificate)=>{
                expiredCertificateString = expiredCertificateString + `${certificate?.owner}` + '\n'
            })

            let certificateString = ''
            certificates.map((certificate)=>{
                certificateString = certificateString + `${certificate?.owner} - ${Math.ceil((certificate?.valid.getTime()-actualDate.getTime())/(1000*60*60*24))} Dias\n`
            })


            const options = {
                from: process.env.EMAIL_FROM,
                to: emailList,
                subject: 'CERTIFICADOS VENCIDOS',
                text: `Certificados vencidos:\n${expiredCertificateString}\nCertificados com vencimento próximo:\n${certificateString}`,
            }

            transporter.sendMail(options, (err: any, info: any)=>{
                if(err)
                    return res.status(400).json({message: 'Ocorreu um erro ao enviar os E-Mails solicitados.'})
                const returnInfo: returnEmail = {
                    accepted: info.accepted,
                    rejected: info.rejected,
                    messageId: info.messageId
                }
                return res.status(200).json(returnInfo)
            })
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json({message: 'Ocorreu um erro ao processar a requisição.'})
        }
    }
}