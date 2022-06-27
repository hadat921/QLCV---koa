import {
    config
} from 'dotenv'

import Koa from 'koa'
const app = new Koa();

config();


const validatecolumns = async (ctx, next) => {
    const {
        columnName,


    } = ctx.request.body;

    if (!columnName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "colums lỗi"

        }
        return;
    }
    await next()
}
export {
    validatecolumns
}