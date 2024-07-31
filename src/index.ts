import express, { Application } from 'express'
import mongoose from 'mongoose'
import certificateRoutes from './routes/certificateRoutes'
import emailRoutes from './routes/emailRoutes'
import userRoutes from './routes/userRoutes'
import regimeRoutes from './routes/regimeRoutes'
import empresaRoutes from './routes/empresaRoutes'
import obrigacaoRoutes from './routes/obrigacaoRoutes'
import atividadeRoutes from './routes/atividadeRoutes'
import usuarioEmpresaRoutes from './routes/userEmpresaRoutes'
import regimeObrigacaoRoutes from './routes/regimeObrigacaoRoutes'
import competenciaRoutes from './routes/competenciaRoutes'
import competenciaAtividadeRoutes from './routes/competenciaAtividadeRoutes'
import EmpresaAtividadeRoutes from './routes/empresaAtividadeRoutes'
import SetorRoutes from './routes/setorRoutes'
import SetorEmpresaRoutes from './routes/setorEmpresaRoutes'
import ExcecaoRoutes from './routes/excecaoRoutes'
import helmet from 'helmet'
import path from 'path'
import cron from 'node-cron'

import dbInit from './config/dbInit'
import Agendamentos from './services/agendamentoMensal'
import { logError } from './services/logs'

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
    atividadeRoutes,
    usuarioEmpresaRoutes,
    regimeObrigacaoRoutes,
    competenciaRoutes,
    competenciaAtividadeRoutes,
    EmpresaAtividadeRoutes,
    SetorEmpresaRoutes,
    SetorRoutes,
    ExcecaoRoutes
)

app.get('*', async (req, res)=>{
    res.sendFile(path.join(__dirname, '../build-front', 'index.html'));
})

app.use(logError)
// correto: 0 2 1 * *
cron.schedule('*/3 * * * *', () => { // Agenda a tarefa para ser executada todo dia 1 de cada mês às 2 horas da manhã
    console.log('Executando tarefa agendada: criação de competências mensais')
    Agendamentos.createCompetenciasMensais()
    .then(result => {
        console.log(result)
    })
    Agendamentos.setActiveMensal()
    .then(result => {
        console.log(result)
    })
}, {
    timezone: "America/Sao_Paulo"
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
    app.listen(80, ()=>{
        console.log('listening on port 80')
    })
})
.catch((err)=>console.log(err))
