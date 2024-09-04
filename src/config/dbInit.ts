import { QueryTypes } from "sequelize";
import sequelize from "./sequelize";
import fs from 'fs'

const env = process.env.ENVIRONMENT === 'DEV' // true or false

const dbInit = async () =>{
    await sequelize.sync({
        alter: true,
        force: false
    })
}

export default dbInit