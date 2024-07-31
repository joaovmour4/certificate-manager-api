import Router from 'express'
import EmpresaAtividadeController from '../controllers/empresaAtividadeController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.get('/empresaatividade', verifyAuth.verifyAuth, EmpresaAtividadeController.getEmpresaAtividades)


export default router