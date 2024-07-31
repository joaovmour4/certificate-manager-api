import Router from 'express'
import RegimeObrigacaoController from '../controllers/regimeObrigacaoController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/atribuiObrigacao', verifyAuth.verifyAuth, RegimeObrigacaoController.associateObrigacao)
router.post('/removeAtribuiObrigacao', verifyAuth.verifyAuth, RegimeObrigacaoController.removeAssociationObrigacao)


export default router