import {
    Cards,
    Users,
    Columns
} from "../models"
var Router = require('koa-router');
var router = new Router();

const verifyToken = require('../middleware/auth');
const XlsxPopulate = require('xlsx-populate');
router.post('/cards', verifyToken, async (ctx, next) => {
    const {
        cardName,
        description,
        // dueDate,
        idColumn,

    } = ctx.request.body
    if (!cardName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "cardName in correct"

        }
        return
    }
    try {

        const newCard = await Cards.create({
            cardName: cardName,
            description: description,
            createBy: ctx.userId,
            // dueDate: dueDate ? moment(dueDate).format("YYYY-MM-DD") : null,
            idColumn: idColumn



        })

        ctx.status = 200;

        ctx.body = {
            success: true,
            message: "Tạo thẻ công việc thành công",
            data: newCard,


        }


    } catch (error) {
        console.log(error)
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: 'Card fails'
        }
        return;

    }
    await next()
})
router.put('/cards/:id', verifyToken, async (ctx, next) => {
    const {
        cardName,
        description,
        // dueDate,
        idColumn,

    } = ctx.request.body
    if (!cardName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "cardName in correct"
        }

        return;
    }

    try {

        const updatedCard = await Cards.findByPk(ctx.params.id)
        await updatedCard.update({
            cardName: cardName,
            description: description,
            //dueDate: dueDate ? moment(dueDate).format("YYYY-MM-DD") : null,
            idColumn: idColumn
        })

        ctx.status = 200;

        ctx.body = {
            success: true,
            message: "Update thẻ công việc thành công",



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
router.put('/cards/addToColumn/:id', verifyToken, async (ctx, next) => {
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
router.get('/card/List', verifyToken, async (ctx, next) => {

    try {

        const card = await Cards.findAll({
            // attributes: [""],
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
                // Modify the workbook.
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

                let start_row = 2
                for (let i = 1; i <= card.length; i++) {


                    workbook.sheet("Sheet1").cell("A" + start_row).value(`${card[i-1].id}`);
                    workbook.sheet("Sheet1").cell("B" + start_row).value(`${card[i-1].cardName}`);
                    workbook.sheet("Sheet1").cell("C" + start_row).value(`${card[i-1].dueDate}`);
                    workbook.sheet("Sheet1").cell("D" + start_row).value(`${card[i-1].description}`);
                    workbook.sheet("Sheet1").cell("E" + start_row).value(`${card[i-1].attachment}`);
                    workbook.sheet("Sheet1").cell("F" + start_row).value(`${card[i-1].comment}`);
                    workbook.sheet("Sheet1").cell("G" + start_row).value(`${card[i-1].createdAt}`);
                    workbook.sheet("Sheet1").cell("H" + start_row).value(`${card[i-1].updatedAt}`);
                    workbook.sheet("Sheet1").cell("I" + start_row).value(`${card[i-1].createBy}`);
                    workbook.sheet("Sheet1").cell("J" + start_row).value(`${card[i-1].idColumn}`);
                    start_row++;

                }


                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/KOA/src/excel/CardAll.xlsx");

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



module.exports = router;