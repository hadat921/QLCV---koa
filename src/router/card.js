import {
    Cards,
} from "../models"
import Router from "koa-router";
import verifyToken from '../middleware/auth'

import _ from 'lodash'
import {
    validateList

} from '../validators/validate'
import {
    validatecard
} from "../validators/card"
import {
    cards,
    createCard,
    updateCard,
    getCardById,
    putCardById,
    deleteCard
} from "../controller/card"
var router = new Router();

router.post('/cards', verifyToken, validatecard, createCard)
router.put('/cards/:id', verifyToken, validatecard, updateCard)
router.get('/cards', verifyToken, validateList, cards)
router.get('/cards/:id', verifyToken, getCardById)
router.delete('/cards/:id', verifyToken, deleteCard)
router.put('/cards-column/:id', verifyToken, putCardById, )

module.exports = router;