import Router from "koa-router";
import verifyToken from '../middleware/auth'
import {
    validatorCard,
    validatorListCard
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

router.post('/cards', verifyToken, validatorCard, createCard)
router.put('/cards/:id', verifyToken, validatorCard, updateCard)
router.get('/cards', verifyToken, validatorListCard, cards)
router.get('/cards/:id', verifyToken, getCardById)
router.delete('/cards/:id', verifyToken, deleteCard)
router.put('/cards-column/:id', verifyToken, validatorCard, putCardById)

export default router;