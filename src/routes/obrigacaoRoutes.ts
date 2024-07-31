import Router from 'express'
import obrigacaoController from "../controllers/ObrigacaoController";
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/obrigacao', verifyAuth.verifyAuth, obrigacaoController.createObrigacao)
router.delete('/obrigacao/:id', verifyAuth.verifyAuth, obrigacaoController.deleteObrigacao)
router.put('/obrigacao/:id', verifyAuth.verifyAuth, obrigacaoController.updateObrigacao)
router.get('/obrigacao/:paranoid', verifyAuth.verifyAuth, obrigacaoController.getObrigacoes)
router.get('/obrigacao/id/:id', verifyAuth.verifyAuth, obrigacaoController.getObrigacao)



export default router