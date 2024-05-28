import Router from 'express'
const router = Router()
import setorEmpresaController from '../controllers/setorEmpresaController'

router.post('/certificate', setorEmpresaController.createRegime)

export default router
