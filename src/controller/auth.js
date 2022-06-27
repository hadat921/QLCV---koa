import {
    Users
} from "../models"
import argon2 from "argon2"
import jwt from "jsonwebtoken";
import {
    getEnv
} from "../config";
const register = async (ctx, next) => {
    const {
        password,
        userName,
        phoneNumber,
    } = ctx.request.body;
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
                message: 'Tài khoản đã tồn tại'
            }
            return;

        } else {
            const hashedpassword = await argon2.hash(password)

            let dataInsert = {
                userName,
                password: hashedpassword,
                phoneNumber
            }
            const newUser = await Users.create(dataInsert)
            await newUser.save()

            ctx.body = {
                success: true,
                message: 'Đăng kí tài khoản thành công',
            }
            return
        }

    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error'
        }


    }
    await next();
}
const login = async (ctx, next) => {
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
        }, getEnv("ACESS_TOKEN_SECRET"));

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
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error'
        }

    }
    await next()
}
const logout = async (ctx, next) => {
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
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error'
        }

    }
    await next()
}
export {
    register,
    login,
    logout
}