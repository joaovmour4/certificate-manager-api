import Router from 'express'
import emailController from '../controllers/emailController'

const router = Router()

router.post('/email', emailController.newEmail)
router.get('/email', emailController.getEmails)
router.get('/email/id/:id', emailController.getEmail)
router.get('/email/search/:name', emailController.findEmail)
router.get('/email/search', emailController.getEmails)
router.put('/email/:id', emailController.updateEmail)
router.delete('/email/:id', emailController.deleteEmail)

router.get('/sendEmail', emailController.sendEmail)

export default router