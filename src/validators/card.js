import {

    Columns
} from "../models"
import Koa from 'koa'
const app = new Koa();


const validatecard = async (ctx, next) => {
    const {
        cardName,
        idColumn,
    } = ctx.request.body;
    if (!cardName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Card không tồn tại"

        }
        return;
    }
    if (idColumn) {
        let checkData = await Columns.findOne({
            where: {
                id: idColumn
            }
        })
        if (!checkData) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: "Khong tim thay Columns co id nhu tren"
            }
            return;
        }

    }
    await next()
}
export {
    validatecard
}