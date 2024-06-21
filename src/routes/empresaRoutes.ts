import Router from 'express'
import empresaController from '../controllers/empresaController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/empresa', verifyAuth.verifyAuth, empresaController.createEmpresa)
router.get('/empresa', verifyAuth.verifyAuth, empresaController.getAllEmpresa)
router.get('/empresas/:filter', verifyAuth.verifyAuth, empresaController.getEmpresas)
router.get('/empresa/:id', verifyAuth.verifyAuth, empresaController.getEmpresa)
router.delete('/empresa/:id', verifyAuth.verifySupervisor, empresaController.deleteEmpresa)
router.put('/empresa/:id', verifyAuth.verifyAuth, empresaController.updateEmpresa)
router.patch('/empresa/active/:id', verifyAuth.verifySupervisor, empresaController.setActiveEmpresa)
router.patch('/empresa/lock/:id', verifyAuth.verifySupervisor, empresaController.lockEmpresa)
router.patch('/empresa/unlock/:id', verifyAuth.verifySupervisor, empresaController.unlockEmpresa)
router.patch('/empresa/usuario/', verifyAuth.verifySupervisor, empresaController.setUsuarioResponsavel)


export default router