import {
    Card,
    User,
    Column
} from "../models"
import {
    convertColumn
} from "../service/columnExcel"
import {
    serviceColumn
} from "../service/serviceColumn"
import moment from "moment"
import {
    Op
} from "sequelize"

const columns = async (ctx, next) => {
    try {
        const {
            download,

        } = ctx.query
        const columnList = await serviceColumn(ctx)
        let data = null;
        if (download) {
            data = await Column.findAll({
                where: columnList
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
            order: [
                ['createdAt', 'ASC']
            ],
            include: [{
                    model: Card,
                    as: "cards"
                },
                {
                    model: User,
                    as: "user_info",
                    where: {
                        state: {
                            [Op.eq]: true,
                        }
                    },
                    required: false,
                    attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt", "state"]
                }
            ]
        })
        ctx.body = {
            success: true,
            message: "Data Columns",
            data: data,

        }

    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: "internal server error",
            error
        }

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
                    where: {
                        state: {
                            [Op.eq]: true,
                        }
                    },
                    required: false,
                    attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt", "state"]
                }
            ]
        })
        if (!column) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Column not found'
            }
            return;
        }
        if (download == "true") {
            const result = await convertColumn(column);
            ctx.set(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");

            ctx.body = result
            return;
        }
        if (column.state === false) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "Column dose not exit"
            }
            return
        }
        ctx.body = {
            success: true,
            message: "Data Columns",
            data: column,

        }
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Column failse'
        }
        return;

    }
    await next()
}
const updateColumById = async (ctx, next) => {
    try {
        let id = ctx.params.id
        let {
            columnName,
            description,
        } = ctx.request.body
        let data = await Column.findByPk(id)
        if (!data) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "Column not found"
            }
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
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: 'Column failse'
            }
            return;
        }
        ctx.body = {
            success: true,
            message: "Update column job successfully",
            data: data
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: "Internal Server Error"
        }
    }
    await next()
}
const createColumn = async (ctx, next) => {
    try {
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
            ctx.status = 500;
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
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: "Internal server error"
        }

    }
}
const removeColumn = async (ctx, next) => {
    try {
        let id = ctx.params.id
        let data = await Column.findByPk(id, {
            attributes: ["id", "columnName", "state", "createColumnBy", "description", "description", "createdAt", "updatedAt", "deletedAt"]
        })
        if (!data) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "Column not found"
            }
            return;
        }
        if (data.state === false) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "Column dose not exit"
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
    }
    await next()

}

export {
    columns,
    getColumnById,
    updateColumById,
    createColumn,
    removeColumn
}