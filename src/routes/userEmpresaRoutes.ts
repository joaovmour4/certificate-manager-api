import Router from 'express'
import UsuarioEmpresaController from '../controllers/userEmpresaController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/atribuiEmpresa', verifyAuth.verifyAuth, UsuarioEmpresaController.associateEmpresa)
router.post('/removeAtribuiEmpresa', verifyAuth.verifyAuth, UsuarioEmpresaController.removeAssociationEmpresa)


export default router