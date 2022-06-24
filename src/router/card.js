import {
    Cards,
    Users,
    Columns
} from "../models"
var router = new Router();
import Router from "koa-router";
const verifyToken = require('../middleware/auth');

import _ from 'lodash'
import moment from "moment";
import {
    convertCard,
    convertCardID
} from "../controller/card"
import {
    validatecard,
    validateList

} from '../validators/validate'
import {
    serviceCard
} from "../service/serviceCard"

router.post('/cards', verifyToken, validatecard, async (ctx, next) => {
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

        if (idColumn) {
            let checkData = await Columns.findOne({
                where: {
                    id: idColumn
                }
            })
            if (checkData) {
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
            }


            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Không tìm thấy Colums có id như trên'
            }
        }
    } catch (err) {
        console.log("Err-------", err)
        return
    }

    await next()
})

router.put('/cards/:id', verifyToken, validatecard, async (ctx, next) => {
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

})
router.get('/cards', verifyToken, validateList, async (ctx, next) => {
    const {
        download,

    } = ctx.query
    let condition = {}
    const cardList = await serviceCard(condition, ctx)

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
        where: cardList,
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

})
router.get('/cards/:id', verifyToken, async (ctx, next) => {
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
        await next()



    }


)
router.delete('/cards/:id', verifyToken, async (ctx, next) => {
    try {

        const deletedCards = await Cards.findByPk(ctx.params.id)




        if (!deletedCards) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                message: 'Không tìm thấy Cards'
            }
            return;
        }


        await deletedCards.destroy();
        ctx.body = {
            success: true,
            message: "Xóa thành công Card"

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
router.put('/cards-column/:id', verifyToken, async (ctx, next) => {
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

})



module.exports = router;