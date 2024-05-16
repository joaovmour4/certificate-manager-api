import Router from 'express'
import CompetenciaController from '../controllers/competenciaController'

const router = Router()

router.post('/Competencia', CompetenciaController.createCompetencia)
router.get('/Competencia', CompetenciaController.getCompetencias)


export default router