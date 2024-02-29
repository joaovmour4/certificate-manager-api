import express, { Application } from 'express'
import mongoose from 'mongoose'
import certificateRoutes from './routes/certificateRoutes'
import helmet from 'helmet'

const cors = require('cors')
const dotenv = require('dotenv').config()

// Basic App configs
const app: Application = express()
app.use(cors())
app.use(helmet())
app.use(express.json())

// Defining routes
app.use('/', certificateRoutes)
app.get('*', (req, res)=>{
    return res.status(200).json({message: 'Server running.'})
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
