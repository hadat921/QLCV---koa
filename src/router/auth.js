import Router from "koa-router";
import verifyToken from '../middleware/auth'
var router = new Router();
import {
    register,
    login,
    logout
} from "../controller/auth"
import {
    validatorRegister,
    validateLogin
} from "../validators/auth"

router.post('/register', validatorRegister, register)
router.post('/login', validateLogin, login)
router.put('/logout', verifyToken, logout)

export default router;