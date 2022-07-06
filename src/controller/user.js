import {
    User
} from "../models"
import {
    serviceUser
} from "../service/serviceUser"
import {
    convertUser,
} from "../service/userExcel"
import moment from "moment"
import {
    Op
} from "sequelize"

const users = async (ctx, next) => {
    const {
        download,

    } = ctx.query
    const listUser = await serviceUser(ctx)
    let data = null
    if (download == "true") {

        data = await User.findAll({
            where: listUser
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
    data = await User.findAll({
        where: listUser,
        order: [
            ['createdAt', 'ASC']
        ],
        attributes: [
            'id', 'userName', 'realName', 'email', 'avatar', 'phoneNumber', 'createdAt', 'updatedAt', "state", 'deletedAt'
        ]
    })
    ctx.body = {
        success: true,
        message: "Get list User success!",
        data: data

    }
    await next()
}
const getUserById = async (ctx, next) => {
    const {
        download
    } = ctx.query
    try {
        const user = await User.findByPk(ctx.params.id, {
            attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt", "state"]
        })
        if (download == "true") {
            const result = await convertUser(user);
            ctx.set(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");
            ctx.body = result
            return;
        }
        if (!user) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'User not found'
            }
            return
        }
        if (user.state === false) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "User dose not exit"
            }
            return
        }
        ctx.body = {
            success: true,
            message: "Data User",
            data: user,
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
    let data = await User.findByPk(id, {
        attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt", "state"]
    })
    if (!data || data.state === false) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            message: "User not found"
        }
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
    ctx.body = {
        success: true,
        message: "Update user succesfully",
        data: data
    }

    await next()
}
const removeUser = async (ctx, next) => {
    try {
        let id = ctx.params.id
        let data = await User.findByPk(id, {
            attributes: ["id", "userName", "state", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt", "deletedAt"]
        })
        if (!data) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "User not found"
            }
            return;
        }
        if (data.state === false) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "User dose not exit"
            }

            return;
        }
        data.state = false;
        const deleteAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        data.deletedAt = deleteAt
        data.save();

        ctx.body = {
            success: true,
            message: "Deleted successfully! ",
            data: data
        }
        return;
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Internal server error'
        }
        await next()
    }
}
export {
    users,
    getUserById,
    updateUser,
    removeUser
}