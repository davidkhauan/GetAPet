const router = require ('express').Router()

const PetController = require ('../controllers/PetController')

const verifyToken = require ('../helpers/VerifyTokenHelper')
const { ImageUploadHelper } = require ('../helpers/ImageUploadHelper')

router.post ('/create', verifyToken, ImageUploadHelper.array ('images'), PetController.create)
// router.post ('/login', UserController.login)
// router.get ('/checkuser', UserController.checkUser)
// router.get ('/:id', UserController.getUserById)
// router.patch ('/edit/:id', verifyToken, ImageUploadHelper.single ("image"), UserController.editUser)

module.exports = router