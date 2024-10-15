import { Sequelize } from 'sequelize'
import { config } from 'dotenv'
const dotenv = config()


const dbName = process.env.SQL_DB_NAME as string
const dbUser = process.env.SQL_DB_USER as string
const dbPassword = process.env.SQL_DB_PASSWORD
const dbHost = process.env.SQL_DB_HOST

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    logging: false,
    dialect: 'mysql'
})

export default sequelize

