import Router from 'express'
import empresaController from '../controllers/empresaController'

const router = Router()

router.post('/empresa', empresaController.createEmpresa)
router.get('/empresas/:filter', empresaController.getEmpresas)
router.get('/empresa/:id', empresaController.getEmpresa)
router.patch('/empresa/active/:id', empresaController.setActiveEmpresa)
router.patch('/empresa/usuario/', empresaController.setUsuarioResponsavel)


export default router