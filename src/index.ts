import express, { Application, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import certificateRoutes from './routes/certificateRoutes'
import emailRoutes from './routes/emailRoutes'
import userRoutes from './routes/userRoutes'
import regimeRoutes from './routes/regimeRoutes'
import empresaRoutes from './routes/empresaRoutes'
import obrigacaoRoutes from './routes/obrigacaoRoutes'
import usuarioEmpresaRoutes from './routes/userEmpresaRoutes'
import regimeObrigacaoRoutes from './routes/regimeObrigacaoRoutes'
import competenciaRoutes from './routes/competenciaRoutes'
import competenciaAtividadeRoutes from './routes/competenciaAtividadeRoutes'
import EmpresaAtividadeRoutes from './routes/empresaAtividadeRoutes'
import SetorRoutes from './routes/setorRoutes'
import SetorEmpresaRoutes from './routes/setorEmpresaRoutes'
import helmet from 'helmet'
import path from 'path'

import dbInit from './config/dbInit'

const pki = require('node-forge').pki
const cors = require('cors')
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')

// Basic App configs
const app: Application = express()
app.use(cors())
app.use(helmet({ contentSecurityPolicy: false, }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../build-front')));

// Defining routes
app.use('/', 
    certificateRoutes, 
    emailRoutes, 
    userRoutes, 
    regimeRoutes, 
    empresaRoutes,
    obrigacaoRoutes,
    usuarioEmpresaRoutes,
    regimeObrigacaoRoutes,
    competenciaRoutes,
    competenciaAtividadeRoutes,
    EmpresaAtividadeRoutes,
    SetorEmpresaRoutes,
    SetorRoutes
)
// Ping de autenticação
app.get('/pingAuth', (req: Request, res: Response) => {
    try{
        if(req.headers['authorization']){
            const token = req.headers['authorization'].split(' ')[1]
            jwt.verify(token, process.env.JWT_SECRET, (err: Error, decoded: JwtPayload)=>{
                if(err)
                    return res.status(401).json({auth: false, message: 'Token expirado, realize o login novamente.'})

                return res.status(200).json({auth: true, decoded})
            })

        }else{
            return res.status(401).json({auth: false, message: 'Nenhum token de autenticação fornecido.'})
        }
    }catch(err: any){
        return res.status(500).json({auth: false, error: err.message})
    }
})

app.get('*', async (req, res)=>{
    res.sendFile(path.join(__dirname, '../build-front', 'index.html'));
})

// Connecting with DB and running the App
mongoose.set('strictQuery', false)
const mongodb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zdqjo6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
async function main(){
    await mongoose.connect(mongodb)
    await dbInit()
}
main()
.then(()=>{
    app.listen(3000, ()=>{
        console.log('listening on port 3000')
    })
})
.catch((err)=>console.log(err))
