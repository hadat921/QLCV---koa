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
const verifyToken = require('../middleware/auth');
const XlsxPopulate = require('xlsx-populate');
import _ from 'lodash'
import moment from "moment";
import {
    convertCard
} from "../controller/card"
const {
    validatecard

} = require('../middleware/validate')

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
                        message: 'Card fails'
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
                message: 'idColumn not found'
            }
        }
    } catch (err) {
        console.log("Err-------", err)
        return
    }

    // await next()
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
        // tao logs
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
                message: 'idColumn not found'
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
            message: 'Card fails aa'
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
router.get('/cards', verifyToken, async (ctx, next) => {
    const {
        download,
        idColumn,
        cardName,
        // createdAtFrom,
        // createdAtTo
    } = ctx.query
    let conditon = {}
    if (idColumn) {
        conditon.idColumn = {
            [Op.eq]: idColumn
        }
    }
    if (cardName) {
        conditon.cardName = {
            [Op.iLike]: cardName
        }
    }
    let data = null;
    if (download) {

        data = await Cards.findAll({
            where: conditon
        })
        //tra ve file excel
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
        where: conditon,
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

    if (_.isEmpty(data)) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            message: "Card khong tim thay"
        }

        return;
    }
    ctx.status = 400;
    ctx.body = {
        data,
        message: "data ne"
    }


    // try {

    //     if (idColumn) {
    //         const cardfilter = await Cards.findAll({
    //             where: {
    //                 idColumn: idColumn
    //             },
    //             include: [{
    //                     model: Columns,
    //                     as: "column_info"
    //                 },

    //                 {
    //                     model: Users,
    //                     as: "user_info",
    //                     attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
    //                 }
    //             ]
    //         })

    //         if (_.isEmpty(cardfilter)) {
    //             ctx.status = 404;
    //             ctx.body = {
    //                 success: false,
    //                 message: "Card not found"
    //             }

    //             return;
    //         }

    //         ctx.body = {
    //             success: true,
    //             cardfilter
    //         }
    //     }
    //     if (cardName) {
    //         const cardfilterName = await Cards.findAll({
    //             where: {
    //                 cardName: cardName
    //             },
    //             include: [{
    //                     model: Columns,
    //                     as: "column_info"
    //                 },

    //                 {
    //                     model: Users,
    //                     as: "user_info",
    //                     attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
    //                 }
    //             ]

    //         })
    //         if (_.isEmpty(cardfilterName)) {
    //             ctx.status = 404;
    //             ctx.body = {
    //                 success: false,
    //                 message: "Card filer by Name not found"
    //             }

    //             return;
    //         }
    //         ctx.body = {
    //             success: true,
    //             cardfilterName
    //         }
    //         return;

    //     } else {


    //         ctx.status = 200;

    //         ctx.body = {
    //             success: true,
    //             data
    //         }
    //         return;
    //     }



    // } catch (error) {
    //     console.log(error)
    //     ctx.status = 403;
    //     ctx.body = {
    //         success: false,
    //         message: 'Card fails aa'
    //     }


    // }
    // await next()

})
router.get('/cards/:id', verifyToken, async (ctx, next) => {

    try {

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
        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value("cardName");
                workbook.sheet("Sheet1").cell("C1").value("dueDate");
                workbook.sheet("Sheet1").cell("D1").value("description");
                workbook.sheet("Sheet1").cell("E1").value("attachment");
                workbook.sheet("Sheet1").cell("F1").value("comment");
                workbook.sheet("Sheet1").cell("G1").value("createdAt");
                workbook.sheet("Sheet1").cell("H1").value("updatedAt");
                workbook.sheet("Sheet1").cell("I1").value("createBy");
                workbook.sheet("Sheet1").cell("J1").value("idColumn");


                workbook.sheet("Sheet1").cell("A2").value(`${card.id}`);
                workbook.sheet("Sheet1").cell("B2").value(`${card.cardName}`);
                workbook.sheet("Sheet1").cell("C2").value(`${card.dueDate}`);
                workbook.sheet("Sheet1").cell("D2").value(`${card.description}`);
                workbook.sheet("Sheet1").cell("E2").value(`${card.attachment}`);
                workbook.sheet("Sheet1").cell("F2").value(`${card.comment}`);
                workbook.sheet("Sheet1").cell("G2").value(`${card.createdAt}`);
                workbook.sheet("Sheet1").cell("H2").value(`${card.updatedAt}`);
                workbook.sheet("Sheet1").cell("I2").value(`${card.createBy}`);
                workbook.sheet("Sheet1").cell("J2").value(`${card.idColumn}`);



                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/KOA/src/excel/CardByID.xlsx");

            });

        ctx.status = 200;

        ctx.body = {
            success: true,
            card
        }


    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Card fails aa'
        }
        return;

    }
    await next()

})
router.delete('/cards/:id', verifyToken, async (ctx, next) => {
    try {

        const deletedCards = await Cards.findByPk(ctx.params.id)



        //User not authorised or post not found 
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
                message: 'Post k tim thay hoac user not authorrised'
            }
        }
        await updatedCard.update({
            idColumn: idColumn
        })

        ctx.status = 200;

        ctx.body = {
            success: true,
            message: "Add card to cot công việc thành công",



        }


    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Card fails aa'
        }
        return;

    }
    await next()

})



module.exports = router;