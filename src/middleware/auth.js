const jwt = require('jsonwebtoken')
import {
    config
} from 'dotenv'
import req from 'express/lib/request';
import request from 'koa/lib/request';
var Router = require('koa-router');
var router = new Router();

const Koa = require('koa');
const app = new Koa();

config();

const verifyToken = async (ctx, next) => {
    // const authorization = ctx.headers('Authorization')
    const {
        authorization
    } = ctx.header;
    // console.log(authorization)

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

        ctx.userId = decoded.payload;
        // console.log(ctx.request.userId)
        await next()
        //AccessToken = object userId ben file auth.js
        //Sau khi token dc cho qua, thi file post cho phep gan' token vao Post de request

    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Token sai rui'
        }
        return;

    }
    await next
}
module.exports = verifyToken