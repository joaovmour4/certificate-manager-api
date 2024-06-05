import dotenv from 'dotenv'
import { User } from '../controllers/userController'
import jwt, { Secret } from 'jsonwebtoken'
dotenv.config()

async function auth(user: User){
    try{
        const userInfo = {user}
        const token = jwt.sign(userInfo, process.env.JWT_SECRET as Secret, {
            expiresIn: '7d'
        })

        return {auth: true, token: token}
    }catch(err){
        return {auth: false, error: err}
    }
}

export default auth