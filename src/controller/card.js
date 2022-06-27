import {
    Cards,
    Users,
    Columns
} from "../models"
import {
    serviceCard
} from "../service/serviceCard"
import moment from "moment"
import _ from 'lodash'

const cards = async (ctx, next) => {
    const {
        download,

    } = ctx.query

    const condition = await serviceCard(ctx)

    let data = null;
    if (download == "true") {

        data = await Cards.findAll({
            where: condition
        })

        const result = await convertCard(data);
        ctx.set(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");

        ctx.body = result
        return;
    }

    data = await Cards.findAll({
        where: condition,
        include: [{
                model: Columns,
                as: "column_info"
            },
            {
                model: Users,
                as: "user_info",
                attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
            }
        ]

    })


    ctx.body = {
        data,
        message: "Data nè"
    }
    await next()



}
const createCard = async (ctx, next) => {
    console.log("-----------");
    try {
        let {
            cardName,
            description,
            dueDate,
            idColumn,

        } = ctx.request.body;
        let dataInsert = {
            cardName: cardName || null,
            description: description || null,
            dueDate: dueDate ? moment(dueDate).format("YYYY-MM-DD HH:mm:ss") : null,
            idColumn: idColumn || null,
            createBy: ctx.state.user.id

        }


        let data = null
        try {
            data = await Cards.create(dataInsert)

        } catch (error) {
            console.log(error)
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: 'Card lỗi'
            }
            return;

        }
        ctx.body = {
            success: true,
            message: "Tạo thẻ công việc thành công",
            data: data,
        }


        return;
    } catch (err) {
        console.log("Err-------", err)
        return
    }
    await next()


}
const updateCard = async (ctx, next) => {
    let id = ctx.params.id
    let {

        cardName,
        description,
        dueDate,
        idColumn,

    } = ctx.request.body
    let data = await Cards.findByPk(id)
    if (!data) {
        return;
    }
    let dataUpdate = {}
    if (cardName && data.cardName != cardName) {
        dataUpdate.cardName = cardName;
    }
    if (description && data.description != description) {

        dataUpdate.description = description;
    }
    if (_.isEmpty(dataUpdate)) {
        ctx.body = {
            success: "true",
            message: " Cập nhật thành công, thông tin không có sự thay đổi"
        }
        return;
    }

    if (idColumn && data.idColumn != idColumn) {
        let checkData = await Columns.findOne({
            where: {
                id: idColumn
            }
        })
        console.log(checkData)

        if (!checkData) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Không tìm thấy column'
            }
            return
        }
        dataUpdate.idColumn = idColumn;
    }
    if (dueDate && data.dueDate != dueDate) {
        dataUpdate.dueDate = dueDate ? moment(dueDate).format("YYYY-MM-DD HH:mm:ss") : null;
    }

    try {
        await data.update(dataUpdate)

    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Card lỗi'
        }
        return;

    }
    ctx.body = {
        success: true,
        message: "Update thẻ công việc thành công ",
        data: data
    }
    await next()

}
const getCardById = async (ctx, next) => {
    const {
        download
    } = ctx.query
    const card = await Cards.findByPk(ctx.params.id, {
        include: [{
                model: Columns,
                as: "column_info"
            },

            {
                model: Users,
                as: "user_info",
                attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
            }
        ]



    })
    if (download == "true") {
        console.log("------------------");
        const result = await convertCardID(card);
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
        card
    }
    return;
    await next()
}
const putCardById = async (ctx, next) => {
    const {

        idColumn,

    } = ctx.request.body

    try {

        const updatedCard = await Cards.findByPk(ctx.params.id)
        if (!updatedCard) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                message: 'Không tìm thấy '
            }
        }
        await updatedCard.update({
            idColumn: idColumn
        })

        ctx.status = 200;

        ctx.body = {
            success: true,
            message: "Thêm card vào cột công việc thành công",



        }


    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Card lỗi'
        }
        return;

    }
    await next()
}
export {
    cards,
    createCard,
    updateCard,
    getCardById,
    putCardById
}