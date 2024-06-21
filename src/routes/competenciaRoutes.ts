import Router from 'express'
import CompetenciaController from '../controllers/competenciaController'

const router = Router()

router.post('/competencia', CompetenciaController.createCompetencia)
router.get('/competencia', CompetenciaController.getCompetencias)


export default router