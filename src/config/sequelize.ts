import { Sequelize } from 'sequelize'
import Empresa from '../schemas/EmpresaSchema'
import Regime from '../schemas/RegimeSchema'
import Usuario from '../schemas/userSchema'
// import dotenv from 'dotenv/config.js'
const dotenv = require('dotenv').config()


const dbName = process.env.SQL_DB_NAME as string
const dbUser = process.env.SQL_DB_USER as string
const dbPassword = process.env.SQL_DB_PASSWORD
const dbHost = process.env.SQL_DB_HOST

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql'
})

export default sequelize

