import {
    config
} from 'dotenv'

import Koa from 'koa'
import emailvalidator from "email-validator"
const app = new Koa();

config();


const validateAuth = async (ctx, next) => {
    const {
        userName,
        password,
        phoneNumber,
        email
    } = ctx.request.body
    const emailValid = emailvalidator.validate(email)
    if (!userName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Thieu userName"
        }
        return;
    }
    if (userName.length > 50) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "tai khoan khong duoc qua 50 ki tu"
        }
        return;
    }
    if (!password) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Thieu passWord"

        }
        return;
    }

    if (!phoneNumber) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Thieu phoneNumber"
        }
        return;


    }
    if (!email) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Thieu email"
        }
        return;
    }

    if (!emailValid) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "sai dinh dang email"
        }
        return;
    }
    await next()
}


const validateLogin = async (ctx, next) => {
    const {
        userName,
        passWord,
        phoneNumber
    } = ctx.request.body
    if (!userName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Thieu userName"
        }
        return;
    }
    if (userName.length > 50) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "tai khoan khong duoc qua 50 ki tu"
        }
        return;
    }
    if (!passWord) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Thieu passWord"

        }
        return;
    }
    if (!phoneNumber) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Thieu phoneNumber"
        }
        return;


    }

}



export {
    validateAuth,
    validateLogin
}