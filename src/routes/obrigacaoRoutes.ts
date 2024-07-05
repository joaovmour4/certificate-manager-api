import Router from 'express'
import obrigacaoController from "../controllers/ObrigacaoController";

const router = Router()

router.post('/obrigacao', obrigacaoController.createObrigacao)
router.delete('/obrigacao/:id', obrigacaoController.deleteObrigacao)
router.put('/obrigacao/:id', obrigacaoController.updateObrigacao)
router.get('/obrigacao/:paranoid', obrigacaoController.getObrigacoes)
router.get('/obrigacao/id/:id', obrigacaoController.getObrigacao)



export default router