import {
    Users
} from "../models"
import argon2 from "argon2"

const jwt = require('jsonwebtoken')
var Router = require('koa-router');
var router = new Router();

const verifyToken = require('../middleware/auth');

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
            message: " missing username, password or phonenumber"
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
                message: 'Username already taken'
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
                message: 'User created Success',
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
        //check for existing user
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


        //Username found columnName
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Incorect user name or password'
            }
            return;
        }


        //Pass valid 
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
        // console.log(ctx.userId)
        //User not authorised or post not found 
        if (!logoutUser.accessToken)
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy User'
            })

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