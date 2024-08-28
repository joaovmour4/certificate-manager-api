import Router from 'express'
import atividadeController from '../controllers/atividadeController'
import verifyAuth from '../services/verifyAuth'
import Agendamentos from '../services/agendamentoMensal'

const router = Router()

router.post('/competenciaAtividade', verifyAuth.verifyAuth, atividadeController.createAtividade)
router.get('/competenciaAtividade', verifyAuth.verifyAuth, atividadeController.getAtividades)

// Rotas de criação externa
router.post('/createCompetencia', verifyAuth.verifyAdmin, Agendamentos.createCompetencia)
router.post('/createAtividades', verifyAuth.verifyAdmin, Agendamentos.createAtividades)

export default router