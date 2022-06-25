import {
    config
} from 'dotenv'

import Koa from 'koa'
import moment from "moment";
const app = new Koa();

config();

const validatecard = async (ctx, next) => {

    const {
        cardName,
    } = ctx.request.body;
    if (!cardName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Card không tồn tại"

        }
        return;
    }

    await next()
}

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
const validateList = async (ctx, next) => {
    const {
        createdAtFrom,
        createdAtTo
    } = ctx.query
    if (createdAtFrom && createdAtTo) {
        let result = moment(createdAtFrom, "YYYY-MM-DD", true).isValid();
        let result1 = moment(createdAtTo, "YYYY-MM-DD", true).isValid();
        console.log(result);
        if (!result || !result1) {

            ctx.body = {
                message: "Sai định dạng, định dạng phải là YYYY-MM-DD ",

            }
            return
        }
    }
    if (createdAtFrom) {
        let result = moment(createdAtFrom, "YYYY-MM-DD", true).isValid();
        console.log(result);
        if (!result) {

            ctx.body = {
                message: "Sai định dạng, định dạng phải là YYYY-MM-DD"

            }
            return
        }
    }
    if (createdAtTo) {
        let result = moment(createdAtTo, "YYYY-MM-DD", true).isValid();
        console.log(result);
        if (!result) {

            ctx.body = {
                message: "Sai định dạng, định dạng phải là YYYY-MM-DD ",

            }
            return
        }
    }

    await next()
}
module.exports = {
    validatecard,
    validatecolumns,
    validateList
}