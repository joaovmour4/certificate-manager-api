import dotenv from 'dotenv'
import bcrypt, { hash } from 'bcrypt'
dotenv.config()

export default class PasswordCrypt{
    static async encrypt(plainTextPassword: string){
        const hash = await bcrypt.hash(plainTextPassword, 10)
        if(hash){
            return {success: true, hash: hash}
        }
        else{
            return {success: false, hash: null}
        }
    }
    static async compare(plainTextPassword: string, hashPassword: string){
        const result = await bcrypt.compare(plainTextPassword, hashPassword)
        return result
    }
}
