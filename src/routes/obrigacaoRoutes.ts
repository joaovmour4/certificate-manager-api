import Router from 'express'
import obrigacaoController from "../controllers/ObrigacaoController";

const router = Router()

router.post('/obrigacao', obrigacaoController.createObrigacao)
router.delete('/obrigacao/:id', obrigacaoController.deleteObrigacao)
router.get('/obrigacao', obrigacaoController.getObrigacoes)
router.get('/insertObrigacoes', obrigacaoController.insertAct)


export default router