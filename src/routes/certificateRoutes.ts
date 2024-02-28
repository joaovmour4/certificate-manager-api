import Router from 'express'
import certificateController from '../controllers/certificateController'

const router = Router()

router.post('/certificate', certificateController.newCertificate)
router.get('/certificate', certificateController.getCertificates)
router.get('/certificate/:owner', certificateController.getCertificate)
router.put('/certificate/:docOwner', certificateController.modifyCertificate)
router.get('/certificate/validity/:docOwner', certificateController.validityVerify)

export default router
