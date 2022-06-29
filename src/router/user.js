import Router from 'koa-router'
var router = new Router();
import {
    users,
    getUserById,
    updateUser
} from "../controller/user"
import verifyToken from '../middleware/auth';

router.get('/users', verifyToken, users)
router.get('/users/:id', verifyToken, getUserById)
router.put('/users/:id', verifyToken, updateUser)

module.exports = router;