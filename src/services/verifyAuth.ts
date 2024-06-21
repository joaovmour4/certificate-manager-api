import { Request, Response, NextFunction } from "express"
import { JwtPayload, Secret } from "jsonwebtoken"
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')

class Auth{
    static async verifyAuth(req: Request, res: Response, next: NextFunction){
        try{
            if(req.headers['authorization']){
                const token = req.headers['authorization'].split(' ')[1]
                jwt.verify(token, process.env.JWT_SECRET as Secret, (err: Error, decoded: JwtPayload)=>{
                    if(err)
                        return res.status(401).json({message: 'Token expirado, realize o login novamente.'})
                    
                    res.user = decoded.user
                    next()
                })
    
            }else{
                return res.status(401).json({message: 'Nenhum token de autenticação fornecido.'})
            }
        }catch(err: any){
            return res.status(400).json({message: err.message})
        }
    }
    static async verifyAdmin(req: Request, res: Response, next: NextFunction){
        try{
            if(req.headers['authorization']){
                const token = req.headers['authorization'].split(' ')[1]
                jwt.verify(token, process.env.JWT_SECRET as Secret, (err: Error, decoded: JwtPayload)=>{
                    if(err)
                        return res.status(401).json({message: 'Token expirado, realize o login novamente.'})
                    
                    res.user = decoded.user
                    if(res.user.cargo === 'admin')
                        next()
                    else
                        return res.status(401).json({message: 'A Função solicitada é reservada para Administradores.'})
                })
    
            }else{
                return res.status(401).json({message: 'Nenhum token de autenticação fornecido.'})
            }
        }catch(err: any){
            return res.status(400).json({message: err.message})
        }
    }
    static async verifySupervisor(req: Request, res: Response, next: NextFunction){
        try{
            if(req.headers['authorization']){
                const token = req.headers['authorization'].split(' ')[1]
                jwt.verify(token, process.env.JWT_SECRET as Secret, (err: Error, decoded: JwtPayload)=>{
                    if(err)
                        return res.status(401).json({message: 'Token expirado, realize o login novamente.'})
                    
                    res.user = decoded.user
                    if(res.user.cargo === 'admin' || res.user.cargo === 'supervisor')
                        next()
                    else
                        return res.status(401).json({message: 'A Função solicitada é reservada para Administradores ou Supervisores.'})
                })
    
            }else{
                return res.status(401).json({message: 'Nenhum token de autenticação fornecido.'})
            }
        }catch(err: any){
            return res.status(400).json({message: err.message})
        }
    }
}

export default Auth