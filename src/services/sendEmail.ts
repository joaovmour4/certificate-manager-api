import { Request, Response } from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

interface returnEmail{
    accepted: Array<string>
    rejected: Array<string>
    messageId: string
}

async function sendEmail(req: Request, res: Response){
    try{
        const receiver: string = req.body.receiver
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth:{
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const options = {
            from: process.env.EMAIL_FROM,
            to: receiver,
            subject: 'Reset password',
            text: 'Here is a reset token.'
        }

        transporter.sendMail(options, (err: unknown, info: any)=>{
            if(err)
                console.log(err)
            else
                console.log(info)
            const returnInfo: returnEmail = {
                accepted: info.accepted,
                rejected: info.rejected,
                messageId: info.messageId
            }
            return res.status(200).json(returnInfo)
        })
    }catch(err:unknown){
        throw new Error('Ocorreu um erro ao processar a requisição.')
    }
}

export {sendEmail}