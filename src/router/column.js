import {
    Cards,
    Users,
    Columns
} from "../models"
import Router from "koa-router";
var router = new Router();

import {
    convertColumn,
    convertColumnbyId
} from "../controller/column"
import {
    serviceColumn
} from "../service/serviceColumn"


import verifyToken from '../middleware/auth'
import {

    validatecolumns,
    validateList
} from "../validators/validate"

router.post('/columns', verifyToken, validatecolumns, async (ctx, next) => {
    let {
        columnName,
        description,

    } = ctx.request.body
    let dataInsert = {
        columnName: columnName || null,
        description: description || null,
        createColumnBy: ctx.state.user.id
    }
    let data = null

    try {

        data = await Columns.create(

            dataInsert)
    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Column lỗi'
        }
        return;


    }
    ctx.body = {
        success: true,
        message: "Tạo cột công việc thành công",
        data: data,

    }
    await next()


})
router.put('/columns/:id', async (ctx, next) => {
    let id = ctx.params.id
    let {
        columnName,
        description,


    } = ctx.request.body
    let data = await Columns.findByPk(id)
    if (!data) {

        return;
    }
    let dataUpdate = {}

    if (columnName && data.columnName != columnName) {
        dataUpdate.columnName = columnName;
    }
    if (description && data.description != columnName) {
        dataUpdate.description = description;
    }
    try {
        console.log("-----------------------");
        await data.update(dataUpdate)
    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Column Lỗi'
        }
        return;
    }
    ctx.status = 200;

    ctx.body = {
        success: true,
        message: "Update cot công việc thành công",



    }



    await next()
})
router.get('/columns/:id', verifyToken, async (ctx, next) => {
    const {
        download
    } = ctx.query
    try {

        const columns = await Columns.findByPk(ctx.params.id, {
            include: [{
                    model: Cards,
                    as: "cards"
                },
                {
                    model: Users,
                    as: "user_info",
                    attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
                }
            ]
        })
        if (!columns) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Không tìm thấy Column'
            }
            return;
        }
        if (download == "true") {
            console.log("------------------");
            const result = await convertColumnbyId(columns);
            ctx.set(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");

            ctx.body = result
            return;

        }



        ctx.status = 200;

        ctx.body = {
            success: true,
            columns
        }


    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Column lỗi'
        }
        return;

    }
    await next()

})
router.get('/columns', verifyToken, validateList, async (ctx, next) => {
    const {
        download,

    } = ctx.query
    let condition = {}



    const columnList = await serviceColumn(condition, ctx)
    let data = null;
    if (download) {
        data = await Columns.findAll({
            where: condition
        })
        const result = await convertColumn(data);
        ctx.set(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");

        ctx.body = result
        return;
    }

    data = await Columns.findAll({
        where: columnList,
        include: [{
                model: Cards,
                as: "cards"
            },
            {
                model: Users,
                as: "user_info",
                attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
            }
        ]


    })
    ctx.status = 200;

    ctx.body = {
        success: true,
        data
    }

    await next()




})





module.exports = router;