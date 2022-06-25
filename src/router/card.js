import {
    Cards,
} from "../models"
import Router from "koa-router";
import verifyToken from '../middleware/auth'

import _ from 'lodash'
import {
    validatecard,
    validateList

} from '../validators/validate'
import {
    cards,
    createCard,
    updateCard,
    getCardById,
    putCardById
} from "../controller/card"
var router = new Router();

router.post('/cards', verifyToken, validatecard, createCard)
router.put('/cards/:id', verifyToken, validatecard, updateCard)
router.get('/cards', verifyToken, validateList, cards)
router.get('/cards/:id', verifyToken, getCardById)
router.delete('/cards/:id', verifyToken, async (ctx, next) => {
    try {

        const deletedCards = await Cards.findByPk(ctx.params.id)




        if (!deletedCards) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                message: 'Không tìm thấy Cards'
            }
            return;
        }


        await deletedCards.destroy();
        ctx.body = {
            success: true,
            message: "Xóa thành công Card"

        }
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error'
        }

    }
    await next()
})
router.put('/cards-column/:id', verifyToken, putCardById, )



module.exports = router;