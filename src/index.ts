import express, { Application } from 'express'
import mongoose from 'mongoose'
import certificateRoutes from './routes/certificateRoutes'
const dotenv = require('dotenv').config()

const app: Application = express()

app.use(express.json())
app.use('/', certificateRoutes)
app.get('/', (req, res)=>{
    return res.status(200).json({message: 'Server running.'})
})

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
