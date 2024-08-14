import { QueryTypes } from "sequelize";
import sequelize from "./sequelize";
import fs from 'fs'

const env = process.env.ENVIRONMENT === 'DEV' // true or false

const dbInit = async () =>{
    await sequelize.sync({
        alter: env,
        force: false
    })
    if(env){
        const sql = fs.readFileSync('C:\\Users\\Cliente\\Documents\\JS\\certificate-manager-api\\src\\config\\preenchimento-tabelas.sql', 'utf-8')
        const queries = sql.split(';').map(query => query.trim()).filter(query => query)
        for (const query of queries) {
            await sequelize.query(query, { type: QueryTypes.RAW });
        }
    }
}

export default dbInit