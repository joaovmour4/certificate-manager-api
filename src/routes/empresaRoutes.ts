import Router from 'express'
import empresaController from '../controllers/empresaController'

const router = Router()

router.post('/empresa', empresaController.createEmpresa)
router.get('/empresa', empresaController.getEmpresas)
router.patch('/empresa/:id', empresaController.setActiveEmpresa)


export default router