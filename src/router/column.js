import Router from "koa-router";
var router = new Router();
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

router.post('/columns', verifyToken, validatorColumn, createColumn)
router.put('/columns/:id', verifyToken, validatorColumn, updateColumById)
router.get('/columns/:id', verifyToken, getColumnById)
router.get('/columns', verifyToken, validatorListColumn, columns)
export default router;