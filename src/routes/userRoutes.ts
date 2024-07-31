import Router from 'express'
import usuarioController from '../controllers/userController'
import verifyAuth from '../services/verifyAuth'

const router = Router()

router.post('/user', verifyAuth.verifySupervisor, usuarioController.createUsuario)
router.put('/user/:id', verifyAuth.verifySupervisor, usuarioController.updateUsuarioById)
router.get('/user', verifyAuth.verifyAuth, usuarioController.getUsers)
router.get('/user/:id', verifyAuth.verifyAuth, usuarioController.getUserById)
router.delete('/user/:id', verifyAuth.verifySupervisor, usuarioController.deleteUser)

// Atividade
router.post('/user/atividade', verifyAuth.verifyAuth, usuarioController.realizaAtividade)
router.post('/user/atividade/cancelarAtividade', verifyAuth.verifyAuth, usuarioController.desmarcaAtividade)

// Autenticação
router.post('/login', usuarioController.login)

export default router