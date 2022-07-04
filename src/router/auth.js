import Router from "koa-router";
import verifyToken from '../middleware/auth'
import {
    register,
    login,
    logout
} from "../controller/auth"
import {
    validatorRegister,
    validateLogin
} from "../validators/auth"
var router = new Router();

router.post('/register', validatorRegister, register)
router.post('/login', validateLogin, login)
router.put('/logout', verifyToken, logout)

export default router;