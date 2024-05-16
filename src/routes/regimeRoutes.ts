import Router from 'express'
import regimeController from '../controllers/RegimeController'

const router = Router()

router.post('/regime', regimeController.createRegime)
router.get('/regime', regimeController.getRegimes)


export default router