import { ObjectId, Schema, Model, model } from "mongoose"

interface IEmail {
    _id: ObjectId
    name: string
    email: string
}

const emailSchema = new Schema<IEmail, Model<IEmail>>({
    name: { type: String },
    email: { type: String },
})

const Email: Model<IEmail> = model('Email', emailSchema)

export { Email, IEmail }