import Router from "koa-router";
import {
    columns,
    getColumnById,
    updateColumById,
    createColumn
} from "../controller/column"
import verifyToken from '../middleware/auth'
import {
    validatorColumn,
    validatorListColumn

} from "../validators/column"
var router = new Router();

router.post('/columns', verifyToken, validatorColumn, createColumn)
router.put('/columns/:id', verifyToken, validatorColumn, updateColumById)
router.get('/columns/:id', verifyToken, getColumnById)
router.get('/columns', verifyToken, validatorListColumn, columns)
export default router;