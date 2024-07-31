import Router from 'express'
import atividadeController from '../controllers/atividadeController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/competenciaAtividade', verifyAuth.verifyAuth, atividadeController.createAtividade)
router.get('/competenciaAtividade', verifyAuth.verifyAuth, atividadeController.getAtividades)

export default router