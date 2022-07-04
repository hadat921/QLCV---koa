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
import {
    convertCard

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
        order: [
            ['createdAt', 'ASC']
        ],
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
        success: true,
        message: "Data card ",
        data: data,

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
        if (idColumn) {
            let checkData = await Column.findOne({
                where: {
                    id: idColumn
                }
            })
            if (!checkData) {
                ctx.status = 404;
                ctx.body = {
                    success: false,
                    message: "Not found Column by id"
                }
                return;
            }

        }
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
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Card fails from Err'
        }

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
        ctx.status = 404;
        ctx.body = {
            success: false,
            message: "Card not found"
        }
        return;
    }

    let dataUpdate = {}
    if (cardName && data.cardName != cardName) {
        dataUpdate.cardName = cardName;
    }
    if (description && data.description != description) {

        dataUpdate.description = description;
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
        const result = await convertCard(card);
        ctx.set(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");

        ctx.body = result
        return;

    }
    ctx.body = {
        success: true,
        message: "Get card by Id Success!",
        data: card

    }

    await next()
}
const putCardById = async (ctx, next) => {
    const {
        idColumn,
    } = ctx.request.body
    if (idColumn) {
        let checkData = await Column.findOne({
            where: {
                id: idColumn
            }
        })
        if (!checkData) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "Not found Column by id"
            }
            return;
        }

    }
    let dataUpdate = {}
    try {
        const updatedCard = await Card.findByPk(ctx.params.id)
        if (idColumn && updatedCard.idColumn != idColumn) {
            dataUpdate.idColumn = idColumn;
        }
        if (!updatedCard) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Card not found'
            }
        }
        await updatedCard.update(dataUpdate)
        ctx.body = {
            success: true,
            message: "Add card to column success",
            data: updatedCard
        }
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Card fail'
        }
        return;
    }
    await next()
}
const deleteCard = async (ctx, next) => {
    try {
        const deletedCards = await Card.findByPk(ctx.params.id)
        if (!deletedCards) {
            ctx.status = 404;
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
const removeCard = async (ctx, next) => {
    try {
        let id = ctx.params.id
        let data = await Card.findByPk(id, {
            attributes: ["id", "cardName", "state", "attachment", "comment", "createBy", "description", "createdAt", "updatedAt", "dueDate", "idColumn"]
        })
        console.log(data.state);
        if (!data) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "Card not found"
            }
            return;
        }
        if (data.state === false) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: "Card dose not exit"
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
    cards,
    createCard,
    updateCard,
    getCardById,
    putCardById,
    deleteCard,
    removeCard
}