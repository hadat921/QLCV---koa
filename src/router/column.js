import {
    Cards,
    Users,
    Columns
} from "../models"
var Router = require('koa-router');
var router = new Router();
import {
    Op
} from 'sequelize'
import _ from 'lodash'
import {
    convertColumn,
    convertColumnbyId
} from "../controller/column"
import moment from "moment";

const verifyToken = require('../middleware/auth');
const XlsxPopulate = require('xlsx-populate');
const {

    validatecolumns
} = require('../middleware/validate')

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
            message: 'Column fails'
        }
        return;


    }
    ctx.body = {
        success: true,
        message: "Tạo cot công việc thành công",
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
        await data.update(dataUpdate)
    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Card fails aa'
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
                message: 'dont find user'
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
            message: 'Column fails aa'
        }
        return;

    }
    await next()

})
router.get('/column/List', verifyToken, async (ctx, next) => {
    const {
        download,
        columnName,
        createColumnBy,
        createdAtFrom,
        createdAtTo
    } = ctx.query
    let condition = {}
    if (columnName) {
        condition.columnName = {
            [Op.substring]: columnName
        }
    }
    if (createColumnBy) {
        condition.createColumnBy = {
            [Op.eq]: createColumnBy
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
        where: condition,
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
    if (_.isEmpty(data)) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            message: "Columns khong tim thay"
        }
        return;
    }

    ctx.status = 200;

    ctx.body = {
        success: true,
        data
    }

    await next()




})





module.exports = router;