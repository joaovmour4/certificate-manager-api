import Router from 'express'
import excecaoController from '../controllers/excecaoController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.get('/excecao', verifyAuth.verifyAuth, excecaoController.getAll)
router.get('/excecao/obrigacoes', verifyAuth.verifyAuth, excecaoController.getObrigacoesExcecoes)
router.post('/excecao', verifyAuth.verifySupervisor, excecaoController.atribuirExcecao)
router.delete('/excecao', verifyAuth.verifySupervisor, excecaoController.removerAtribuicaoExcecao)



export default router