import Router from 'express'
import RegimeAtividadeController from '../controllers/regimeAtividadeController'

const router = Router()

router.post('/atribuiAtividade', RegimeAtividadeController.associateAtividade)
router.post('/removeAtribuiAtividade', RegimeAtividadeController.removeAssociationAtividade)


export default router