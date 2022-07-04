import Router from 'koa-router'
import {
    users,
    getUserById,
    updateUser,
    removeUser
} from "../controller/user"
import verifyToken from '../middleware/auth';
var router = new Router();

router.get('/users', verifyToken, users)
router.get('/users/:id', verifyToken, getUserById)
router.put('/users/:id', verifyToken, updateUser)
router.put('/users/remove/:id', verifyToken, removeUser)

export default router;