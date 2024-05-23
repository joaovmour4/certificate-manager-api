import Router from 'express'
import usuarioController from '../controllers/userController'

const router = Router()

router.post('/user', usuarioController.createUsuario)
router.put('/user/:id', usuarioController.updateUsuarioById)
router.get('/user', usuarioController.getUsers)
router.get('/user/:id', usuarioController.getUserById)
router.delete('/user/:id', usuarioController.deleteUser)

// Atividade
router.post('/user/atividade', usuarioController.realizaAtividade)
router.post('/user/atividade/cancelarAtividade', usuarioController.desmarcaAtividade)


export default router