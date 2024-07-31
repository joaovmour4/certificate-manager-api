import Router from 'express'
import AtividadeController from '../controllers/atividadeController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/atividade', verifyAuth.verifyAuth, AtividadeController.createAtividade)
router.get('/atividade', verifyAuth.verifyAuth, AtividadeController.getAtividades)



export default router