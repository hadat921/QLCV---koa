import {
    Card,
    Column,
    User
}
from "../models"
import {
    serviceCard
} from "../service/serviceCard"
import moment from "moment"
import _ from 'lodash'
import {
    convertCard,
    convertCardID
} from "../service/cardExcel"

const cards = async (ctx, next) => {
    const {
        download,

    } = ctx.query

    const condition = await serviceCard(ctx)

    let data = null;
    if (download == "true") {

        data = await Card.findAll({
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

    data = await Card.findAll({
        where: condition,
        include: [{
                model: Column,
                as: "column_info"
            },
            {
                model: User,
                as: "user_info",
                attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
            }
        ]

    })


    ctx.body = {
        data,
        message: "Data "
    }
    await next()
}
const createCard = async (ctx, next) => {
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
            data = await Card.create(dataInsert)
        } catch (error) {
            console.log("Create Card . Err when create card", error);
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: 'Card failse'
            }
            return;
        }
        ctx.body = {
            success: true,
            message: "Create a successful card",
            data: data,
        }


        return;
    } catch (err) {
        console.log(err)

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
    let data = await Card.findByPk(id)
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
            message: " Updated successfully, information has not changed"
        }
        return;
    }

    if (idColumn && data.idColumn != idColumn) {
        let checkData = await Column.findOne({
            where: {
                id: idColumn
            }
        })
        if (!checkData) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Column not found'
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
            message: 'Card fails'
        }
        return;

    }
    ctx.body = {
        success: true,
        message: "Update card job successful ",
        data: data
    }
    await next()

}
const getCardById = async (ctx, next) => {
    const {
        download
    } = ctx.query
    const card = await Card.findByPk(ctx.params.id, {
        include: [{
                model: Column,
                as: "column_info"
            },

            {
                model: User,
                as: "user_info",
                attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
            }
        ]
    })
    if (download == "true") {
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

    await next()
}
const putCardById = async (ctx, next) => {
    const {

        idColumn,

    } = ctx.request.body

    try {

        const updatedCard = await Card.findByPk(ctx.params.id)
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
            message: "Add tags to column work",
        }
    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Card failse'
        }
        return;

    }
    await next()
}
const deleteCard = async (ctx, next) => {
    try {

        const deletedCards = await Cards.findByPk(ctx.params.id)
        if (!deletedCards) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                message: 'Card not found'
            }
            return;
        }
        await deletedCards.destroy();
        ctx.body = {
            success: true,
            message: "Delete Card Successfully"

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
export {
    cards,
    createCard,
    updateCard,
    getCardById,
    putCardById,
    deleteCard
}