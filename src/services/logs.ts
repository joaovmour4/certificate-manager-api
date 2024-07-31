import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

const logError = async (error:Error, req: Request, res: Response, next: NextFunction) => {
    const logsDir = path.join(__dirname, '../', 'logs')
    if(!fs.existsSync(logsDir))
        fs.mkdirSync(logsDir)
    const errorLogsDir = path.join(logsDir, 'error')
    if(!fs.existsSync(errorLogsDir))
        fs.mkdirSync(errorLogsDir)

    const logFilePath = path.join(errorLogsDir, 'error.log')

    const logMessage = `[${new Date().toISOString()}] - ${error.stack}\n`

    fs.appendFile(logFilePath, logMessage, (err) => {
        if(err){
            console.log(err)
        }
    })
    return res.status(500).json({message: 'Erro inesperado.'})
}
const logAtividade = async (user: string, marcar: boolean, obrigacao: string, competencia: string, empresa: string) => {
    try{
        const logsDir = path.join(__dirname, '../', 'logs')
        if(!fs.existsSync(logsDir))
            fs.mkdirSync(logsDir)
        const atividadesLogsDir = path.join(logsDir, 'atividades')
        if(!fs.existsSync(atividadesLogsDir))
            fs.mkdirSync(atividadesLogsDir)

        const logFilePath = path.join(atividadesLogsDir, 'atividades.log')

        const logMessage = `[${new Date().toISOString()}] - ${user} | ${marcar?'MARCOU':'DESMARCOU'} | ${obrigacao} - ${competencia} | ${empresa}\n`

        fs.appendFile(logFilePath, logMessage, (err) => {
            if(err){
                console.log(err)
            }
        })
        return logMessage
    }
    catch(err: unknown){
        return err
    }
}

export { logError, logAtividade }