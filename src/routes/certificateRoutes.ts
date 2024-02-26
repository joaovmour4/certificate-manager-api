import Router from 'express'
import certificateController from '../controllers/certificateController'

const router = Router()

router.post('/certificate', certificateController.newCertificate)

export default router
