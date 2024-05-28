import Router from 'express'
import setorController from '../controllers/setorController'

const router = Router()

router.post('/setor', setorController.createSetor)
router.get('/setor', setorController.getSetores)


export default router