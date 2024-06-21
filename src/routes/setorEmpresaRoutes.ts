import Router from 'express'
const router = Router()
import setorEmpresaController from '../controllers/setorEmpresaController'
import Auth from '../services/verifyAuth'

router.post('/setor/empresa', Auth.verifySupervisor, setorEmpresaController.atribuirSetorEmpresa)
router.delete('/setor/empresa', Auth.verifySupervisor, setorEmpresaController.removeAtribuicaoSetorEmpresa)

export default router
