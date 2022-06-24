import {
    Users
} from "../models"
import argon2 from "argon2"

import jwt from "jsonwebtoken";
import Router from "koa-router";
var router = new Router();

import verifyToken from '../middleware/auth'

router.post('/register', async (ctx, next) => {
    const {
        password,
        userName,
        phoneNumber
    } = ctx.request.body;


    if (!userName || !password || !phoneNumber) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: " Nhập thiếu password, username hoặc số điện thoại"
        }
        return;

    }
    try {
        const user = await Users.findOne({
            where: {
                userName: userName
            }
        })

        const checkData = await Users.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        })

        if (user || checkData) {
            ctx.status = 400
            ctx.body = {
                success: false,
                message: 'Tài khoản đã được đăng kí'
            }
            return

        } else {
            const hashedpassword = await argon2.hash(password)

            let dataInsert = {
                userName,
                password: hashedpassword,
                phoneNumber
            }
            console.log(dataInsert)
            const newUser = await Users.create(dataInsert)
            await newUser.save()

            ctx.body = {
                success: true,
                message: 'Đăng kí tài khoản thành công',
            }
            return
        }





    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error'
        }


    }
    await next();
})
router.post('/login', async (ctx, next) => {
    const {
        password,
        userName,
    } = ctx.request.body;

    if (!userName || !password) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: " missing username or password "
        }
        return;

    }
    try {

        const user = await Users.findOne({

            where: {
                userName: userName.toLowerCase().toString()
            }
        })




        if (!user) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Incorect user name or password'
            }
            return;
        }



        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Incorect user name or password'
            }
            return;
        }



        const accessToken = jwt.sign({
            payload: user.id
        }, process.env.ACESS_TOKEN_SECRET);

        await user.update({
            accessToken: accessToken

        })


        ctx.body = {
            userName: userName,
            success: true,
            message: 'Login thanh cong',
            accessToken,


        }



    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error11'
        }

    }
    await next()
})
router.put('/logout', verifyToken, async (ctx, next) => {

    try {

        const logoutUser = await Users.findByPk(

            ctx.state.user.id

        )


        if (logoutUser.accessToken == null) {

            ctx.status = 401;
            ctx.body = {
                success: false,
                message: 'Không tìm thấy User'

            }
            return;
        }



        await logoutUser.update({
                accessToken: null
            }

        );
        ctx.body = {
            success: true,
            message: "Logout thanh cong"

        }
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server errora'
        }

    }
    await next()
})



module.exports = router;