import Router from 'express'
import emailController from '../controllers/emailController'
const router = Router()

router.post('/email', emailController.newEmail)
router.get('/email', emailController.getEmails)
router.put('/email/:id', emailController.updateEmail)
router.delete('/email/:id', emailController.deleteEmail)

export default router