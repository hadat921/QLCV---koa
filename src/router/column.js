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

    validatecolumns,
    validateList
} from "../validators/validate"

router.post('/columns', verifyToken, validatecolumns, createColumn)
router.put('/columns/:id', verifyToken, validatecolumns, updateColumById)
router.get('/columns/:id', verifyToken, getColumnById)
router.get('/columns', verifyToken, validateList, columns)
module.exports = router;