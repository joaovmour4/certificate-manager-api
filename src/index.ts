import express, { Application } from 'express'

const app: Application = express()
const certificateRoutes = require('./routes/certificateRoutes')

app.use(express.json())
app.use('/', certificateRoutes)
app.get('/', (req, res)=>{
    return res.status(200).json({message: 'Server running.'})
})

app.listen(3000, ()=>{
    console.log('listening on port 3000')
})