import Router from 'express'
import certificateController from '../controllers/certificateController'
const multer = require('multer')
const router = Router()

router.post('/certificate', multer().single('certFile'), certificateController.newCertificate)
router.get('/certificate', certificateController.getCertificates)
router.get('/certificate/:owner&:validFilter', certificateController.getCertificate)
router.put('/certificate/:docOwner', certificateController.modifyCertificate)
router.get('/certificate/validity/:docOwner', certificateController.validityVerify)
router.delete('/certificate/:id', certificateController.deleteCertificate)

export default router
