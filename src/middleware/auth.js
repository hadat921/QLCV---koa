const jwt = require('jsonwebtoken')
import {
    config
} from 'dotenv'

import Koa from 'koa'


const app = new Koa();

config();

const verifyToken = async (ctx, next) => {

    const {
        authorization
    } = ctx.header;


    if (!authorization) {
        ctx.status = 401;
        ctx.body = {
            success: false,
            message: 'Access token not found hihihi'
        }
        return;
    }

    try {
        const decoded = jwt.verify(authorization, process.env.ACESS_TOKEN_SECRET)

        ctx.state.user = {
            id: decoded.payload
        };

        console.log(ctx.state.user)

    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Token sai rui'
        }
        return;

    }
    await next()
}
module.exports = verifyToken