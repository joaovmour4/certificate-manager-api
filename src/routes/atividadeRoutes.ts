import Router from 'express'
import AtividadeController from '../controllers/atividadeController'

const router = Router()

router.post('/atividade', AtividadeController.createAtividade)
router.get('/atividade', AtividadeController.getAtividades)



export default router