import sequelize from "./sequelize";

const env = process.env.ENVIRONMENT === 'DEV' // true or false

const dbInit = async () =>{
    await sequelize.sync({
        alter: env,
        force: false
    })
}

export default dbInit