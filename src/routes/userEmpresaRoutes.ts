import Router from 'express'
import UsuarioEmpresaController from '../controllers/userEmpresaController'

const router = Router()

router.post('/atribuiEmpresa', UsuarioEmpresaController.associateEmpresa)
router.post('/removeAtribuiEmpresa', UsuarioEmpresaController.removeAssociationEmpresa)


export default router