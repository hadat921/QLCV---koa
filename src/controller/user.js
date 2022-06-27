import {
    Users
} from "../models"
import Router from 'koa-router'
var router = new Router();
import {
    serviceUser
} from "../service/serviceUser"
import {
    convertUser,
    convertUserbyId
} from "../controller/userExcel"



const users = async (ctx, next) => {
    const {
        download,

    } = ctx.query
    let condition = {}
    const listUser = await serviceUser(condition, ctx)
    let data = null
    if (download == "true") {

        data = await Users.findAll({
            where: condition
        })

        const result = await convertUser(data);
        ctx.set(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");

        ctx.body = result
        return;
    }
    data = await Users.findAll({
        where: listUser,
        attributes: [
            'id', 'userName', 'realName', 'email', 'avatar', 'phoneNumber', 'createdAt', 'updatedAt'
        ]
    })



    ctx.body = {
        success: true,
        data

    }
    await next()

}
const getUserById = async (ctx, next) => {
    const {
        download
    } = ctx.query

    try {
        const user = await Users.findByPk(ctx.params.id, {
            attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]

        })
        if (download == "true") {
            console.log("------------------");
            const result = await convertUserbyId(user);
            ctx.set(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");

            ctx.body = result
            return;

        }

        if (!user) {
            ctx.body = {
                success: false,
                message: 'Không tìm thấy User'
            }
            return
        }
        ctx.body = {
            success: true,
            user
        }
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error'
        }
    }
    await next()
}
const updateUser = async (ctx, next) => {
    let id = ctx.params.id
    let {
        realName,
        email,
        avatar,
    } = ctx.request.body
    let data = await Users.findByPk(id)
    if (!data) {
        return;
    }
    let dataUpdate = {}
    if (realName && data.realName != realName) {
        dataUpdate.realName = realName;
    }
    if (email && data.email != email) {
        dataUpdate.email = email;
    }
    if (avatar && data.avatar != avatar) {
        dataUpdate.avatar = avatar;
    }
    try {
        await data.update(dataUpdate)

    } catch (error) {

        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error'
        }
        return;

    }
    ctx.status = 200;
    ctx.body = {
        success: true,
        message: "Update thành công User"
    }

    await next()
}

export {
    users,
    getUserById,
    updateUser

}