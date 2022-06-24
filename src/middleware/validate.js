const jwt = require('jsonwebtoken')
import {
    config
} from 'dotenv'

import Koa from 'koa'
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
            message: "cardName in correct1111"

        }
        return;
    }

    await next()
}

const validatecolumns = async (ctx, next) => {
    const {
        columnName

    } = ctx.request.body;
    if (!columnName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "colums failaaa"

        }
        return;
    }
    await next()
}
module.exports = {
    validatecard,
    validatecolumns
}