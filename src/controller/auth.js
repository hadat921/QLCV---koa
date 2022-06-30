import {
    User
}
from "../models";
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
        const user = await User.findOne({
            where: {
                userName: userName
            }
        })

        const checkData = await User.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        })

        if (user || checkData) {
            ctx.status = 400
            ctx.body = {
                success: false,
                message: 'Account already exists'
            }
            return;

        } else {
            const hashedpassword = await argon2.hash(password)

            let dataInsert = {
                userName,
                password: hashedpassword,
                phoneNumber
            }
            const newUser = await User.create(dataInsert)
            await newUser.save()

            ctx.body = {
                success: true,
                message: 'Successful account registration',
            }
            return
        }

    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error from auth'
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

        const user = await User.findOne({

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
            message: 'Login successfully',
            data: accessToken,


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

        const logoutUser = await User.findByPk(

            ctx.state.user.id

        )
        if (logoutUser.accessToken == null) {

            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'User not found'

            }
            return;
        }
        await logoutUser.update({
                accessToken: null
            }

        );
        ctx.body = {
            success: true,
            message: "Logout successfully",
            data: logoutUser.accessToken

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