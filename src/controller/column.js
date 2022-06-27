import {
    Card,
    User,
    Column
} from "../models"
import {
    convertColumn,
    convertColumnbyId
} from "../service/columnExcel"
import {
    serviceColumn
} from "../service/serviceColumn"

const columns = async (ctx, next) => {
    const {
        download,

    } = ctx.query
    let condition = {}
    const columnList = await serviceColumn(condition, ctx)
    let data = null;
    if (download) {
        data = await Column.findAll({
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

    data = await Column.findAll({
        where: columnList,
        include: [{
                model: Card,
                as: "cards"
            },
            {
                model: User,
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
}
const getColumnById = async (ctx, next) => {
    const {
        download
    } = ctx.query
    try {

        const column = await Column.findByPk(ctx.params.id, {
            include: [{
                    model: Card,
                    as: "cards"
                },
                {
                    model: User,
                    as: "user_info",
                    attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
                }
            ]
        })
        if (!column) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Column not found'
            }
            return;
        }
        if (download == "true") {
            const result = await convertColumnbyId(column);
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
            column
        }


    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Column failse'
        }
        return;

    }
    await next()
}
const updateColumById = async (ctx, next) => {
    let id = ctx.params.id
    let {
        columnName,
        description,


    } = ctx.request.body
    let data = await Column.findByPk(id)
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
            message: 'Column failse'
        }
        return;
    }
    ctx.status = 200;

    ctx.body = {
        success: true,
        message: "Update column job successfully",
    }
    await next()
}
const createColumn = async (ctx, next) => {
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
        data = await Column.create(dataInsert)
    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Column failse'
        }
        return;
    }
    ctx.body = {
        success: true,
        message: "Successful column job creation",
        data: data,

    }
    await next()
}

export {
    columns,
    getColumnById,
    updateColumById,
    createColumn
}