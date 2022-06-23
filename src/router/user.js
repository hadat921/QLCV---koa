import {
    Users
} from "../models"
import {
    Op
} from 'sequelize'
const jwt = require('jsonwebtoken')
var Router = require('koa-router');
var router = new Router();
const XlsxPopulate = require('xlsx-populate');
import {
    convertUser,
    convertUserbyId
} from "../controller/user"


const verifyToken = require('../middleware/auth');

router.get('/user/List', verifyToken, async (ctx, next) => {
    const {
        download,
        userName,
        realName,
        email,
        phoneNumber,
        createdAtFrom,
        createdAtTo
    } = ctx.query
    let condition = {}
    if (userName) {
        condition.userName = {
            [Op.substring]: userName
        }
    }
    if (realName) {
        condition.realName = {
            [Op.substring]: realName
        }
    }
    if (email) {
        condition.email = {
            [Op.substring]: email
        }
    }
    if (phoneNumber) {
        condition.phoneNumber = {
            [Op.eq]: phoneNumber
        }
    }
    if (createdAtFrom && createdAtTo) {
        const from = moment(createdAtFrom).startOf('day').format("YYYY-MM-DD HH:mm:ss")
        const to = moment(createdAtTo).endOf('day').format("YYYY-MM-DD HH:mm:ss")
        condition.createdAt = {
            [Op.between]: [from, to]
        }
    }
    if (createdAtFrom) {
        const from = moment(createdAtFrom).startOf('day').format("YYYY-MM-DD HH:mm:ss")

        condition.createdAt = {
            [Op.gte]: from
        }
    }
    if (createdAtTo) {
        const to = moment(createdAtTo).endOf('day').format("YYYY-MM-DD HH:mm:ss")

        condition.createdAt = {
            [Op.lte]: to
        }
    }
    let data = null
    if (download == "true") {

        data = await Users.findAll({
            where: condition
        })
        //tra ve file excel
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
        where: condition,
        attributes: [
            'id', 'userName', 'realName', 'email', 'avatar', 'phoneNumber', 'createdAt', 'updatedAt'
        ]
    })



    ctx.body = {
        success: true,
        data

    }
    await next()

})
router.get('/users/:id', verifyToken, async (ctx, next) => {
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
                message: 'dont find user'
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
})
router.put('/users/:id', verifyToken, async (ctx, next) => {
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
        message: "Update thanh cong user"
    }

    await next()
})










module.exports = router;