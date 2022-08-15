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
import {
    random
} from "../service/randomCode"
var router = new Router();

router.post('/register', validatorRegister, register)
router.post('/login', validateLogin, login, random)
router.put('/logout', verifyToken, logout)

export default router;