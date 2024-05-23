import Router from 'express'
import atividadeController from '../controllers/atividadeController'

const router = Router()

router.post('/competenciaAtividade', atividadeController.createAtividade)
router.get('/competenciaAtividade', atividadeController.getAtividades)

export default router