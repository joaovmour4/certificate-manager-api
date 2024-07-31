import Router from 'express'
import regimeController from '../controllers/RegimeController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/regime', verifyAuth.verifyAuth, regimeController.createRegime)
router.get('/regime', verifyAuth.verifyAuth, regimeController.getRegimes)


export default router