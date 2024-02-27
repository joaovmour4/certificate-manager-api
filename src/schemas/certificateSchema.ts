import mongoose, { ObjectId, Schema, Model, model } from 'mongoose'

interface ICertificate {
    _id: ObjectId
    owner: string
    docOwner: string
    issuing: Date
    valid: Date
}

const certificateSchema = new Schema<ICertificate, Model<ICertificate>>({
    owner: { type: String },
    docOwner: { type: String },
    issuing: { type: Date },
    valid: { type: Date }
})

const Certificate: Model<ICertificate> = model('Certificate', certificateSchema)

export { Certificate, ICertificate }