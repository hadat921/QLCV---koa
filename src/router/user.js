import {
    Users
} from "../models"
import argon2 from "argon2"
import {
    body
} from "koa/lib/response";
const jwt = require('jsonwebtoken')
var Router = require('koa-router');
var router = new Router();
const XlsxPopulate = require('xlsx-populate');

const verifyToken = require('../middleware/auth');

router.get('/user/List', verifyToken, async (ctx, next) => {
    try {


        let user = await Users.findAll({
            attributes: [
                'id', 'userName', 'realName', 'email', 'avatar', 'phoneNumber', 'createdAt', 'updatedAt'
            ]
        })

        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                // Modify the workbook.
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value("userName");
                workbook.sheet("Sheet1").cell("C1").value("realName");
                workbook.sheet("Sheet1").cell("D1").value("email");
                workbook.sheet("Sheet1").cell("E1").value("avtar");
                workbook.sheet("Sheet1").cell("F1").value("phoneNumber");
                workbook.sheet("Sheet1").cell("G1").value("createdAt");
                workbook.sheet("Sheet1").cell("H1").value("updatedAt");

                let start_row = 2
                for (let i = 1; i <= user.length; i++) {


                    workbook.sheet("Sheet1").cell("A" + start_row).value(`${user[i-1].id}`);
                    workbook.sheet("Sheet1").cell("B" + start_row).value(`${user[i-1].userName}`);
                    workbook.sheet("Sheet1").cell("C" + start_row).value(`${user[i-1].realName}`);
                    workbook.sheet("Sheet1").cell("D" + start_row).value(`${user[i-1].email}`);
                    workbook.sheet("Sheet1").cell("E" + start_row).value(`${user[i-1].avatar}`);
                    workbook.sheet("Sheet1").cell("F" + start_row).value(`${user[i-1].phoneNumber}`);
                    workbook.sheet("Sheet1").cell("G" + start_row).value(`${user[i-1].createdAt}`);
                    workbook.sheet("Sheet1").cell("H" + start_row).value(`${user[i-1].updatedAt}`);
                    start_row++;

                }



                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/KOA/src/excel/User.xlsx");
            });

        ctx.body = {
            success: true,
            user
        }
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.json = {
            success: false,
            message: 'Internal error server 11 hehe'
        }
    }
    await next()

})
router.get('/users/:id', verifyToken, async (ctx, next) => {

    try {


        const user = await Users.findByPk(ctx.params.id, {
            attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]

        })
        // Load a new blank workbook
        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                // Modify the workbook.
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value("userName");
                workbook.sheet("Sheet1").cell("C1").value("realName");
                workbook.sheet("Sheet1").cell("D1").value("email");
                workbook.sheet("Sheet1").cell("E1").value("avtar");
                workbook.sheet("Sheet1").cell("F1").value("phoneNumber");
                workbook.sheet("Sheet1").cell("G1").value("createdAt");
                workbook.sheet("Sheet1").cell("H1").value("updatedAt");

                workbook.sheet("Sheet1").cell("A2").value(`${user.dataValues.id}`);
                workbook.sheet("Sheet1").cell("B2").value(`${user.dataValues.userName}`);
                workbook.sheet("Sheet1").cell("C2").value(`${user.dataValues.realName}`);
                workbook.sheet("Sheet1").cell("D2").value(`${user.dataValues.email}`);
                workbook.sheet("Sheet1").cell("E2").value(`${user.avatar}`);
                workbook.sheet("Sheet1").cell("F2").value(`${user.phoneNumber}`);
                workbook.sheet("Sheet1").cell("G2").value(`${user.createdAt}`);
                workbook.sheet("Sheet1").cell("H2").value(`${user.updatedAt}`);


                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/KOA/src/excel/UserDetail.xlsx");
            });

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
    const {
        realName,
        email,
        avatar,


    } = ctx.request.body
    try {
        const updatedUser = await Users.findByPk(ctx.userId)

        if (!updatedUser) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                message: 'Khong tim thay user'
            }
            return
        }

        await updatedUser.update({
            realName: realName,
            email: email,
            avatar: avatar,
        })
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: "Update thanh cong user"
        }
        return



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










module.exports = router;