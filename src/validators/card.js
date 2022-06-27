import {

    Column
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
            message: "Card not found"

        }
        return;
    }
    if (idColumn) {
        let checkData = await Column.findOne({
            where: {
                id: idColumn
            }
        })
        if (!checkData) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: "Not found Column by Id"
            }
            return;
        }

    }
    await next()
}
export {
    validatecard
}