import Router from 'express'
import atividadeController from "../controllers/atividadeController";

const router = Router()

router.post('/atividade', atividadeController.createAtividade)
router.delete('/atividade/:id', atividadeController.deleteAtividade)
router.get('/atividade', atividadeController.getAtividades)
router.get('/insertAtividades', atividadeController.insertAct)


export default router