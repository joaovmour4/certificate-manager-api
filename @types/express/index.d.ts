import { Express } from "express"
declare global {
    namespace Express {
        interface Response{
            user?: any
        }
    }
}