import Router from 'express'
import EmpresaAtividadeController from '../controllers/empresaAtividadeController'

const router = Router()

router.get('/empresaatividade', EmpresaAtividadeController.getEmpresaAtividades)


export default router