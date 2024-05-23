import Router from 'express'
import RegimeObrigacaoController from '../controllers/regimeObrigacaoController'

const router = Router()

router.post('/atribuiObrigacao', RegimeObrigacaoController.associateObrigacao)
router.post('/removeAtribuiObrigacao', RegimeObrigacaoController.removeAssociationObrigacao)


export default router