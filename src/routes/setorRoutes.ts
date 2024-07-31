import Router from 'express'
import setorController from '../controllers/setorController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/setor', verifyAuth.verifyAdmin, setorController.createSetor)
router.get('/setor', verifyAuth.verifyAuth, setorController.getSetores)


export default router