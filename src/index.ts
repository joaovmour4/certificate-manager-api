import express, { Application } from 'express'
import mongoose from 'mongoose'
import certificateRoutes from './routes/certificateRoutes'
import helmet from 'helmet'
import path from 'path'

const pki = require('node-forge').pki
const cors = require('cors')
const dotenv = require('dotenv').config()

// Basic App configs
const app: Application = express()
app.use(cors())
app.use(helmet({ contentSecurityPolicy: false, }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../build-front')));

// Defining routes
app.use('/', certificateRoutes)
app.get('*', async (req, res)=>{
    res.sendFile(path.join(__dirname, '../build-front', 'index.html'));
})

// Connecting with DB and running the App
mongoose.set('strictQuery', false)
const mongodb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zdqjo6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
async function main(){
    await mongoose.connect(mongodb)
}
main()
.then(()=>{
    app.listen(3000, ()=>{
        console.log('listening on port 3000')
    })
})
.catch((err)=>console.log(err))
