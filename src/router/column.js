import {
    Cards,
    Users,
    Columns
} from "../models"
var Router = require('koa-router');
var router = new Router();

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
        createColumnBy: ctx.userId
    }
    console.log(ctx.userId)
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

    try {

        const columns = await Columns.findByPk(ctx.params.id)
        if (!columns) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'dont find user'
            }
            return;
        }

        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value(`columnName`);
                workbook.sheet("Sheet1").cell("C1").value(`createColumnBy`);
                workbook.sheet("Sheet1").cell("D1").value(`description`);
                workbook.sheet("Sheet1").cell("E1").value(`createdAt`);
                workbook.sheet("Sheet1").cell("F1").value(`updatedAt`);


                workbook.sheet("Sheet1").cell("A2").value(`${columns.id}`);
                workbook.sheet("Sheet1").cell("B2").value(`${columns.columnName}`);
                workbook.sheet("Sheet1").cell("C2").value(`${columns.createColumnBy}`);
                workbook.sheet("Sheet1").cell("D2").value(`${columns.description}`);
                workbook.sheet("Sheet1").cell("E2").value(`${columns.createdAt}`);
                workbook.sheet("Sheet1").cell("F2").value(`${columns.updatedAt}`);



                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/KOA/src/excel/ColumnByID.xlsx");

            });

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

    try {

        const columns = await Columns.findAll({
            // attributes: [""],
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

        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                // Modify the workbook.
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value(`columnName`);
                workbook.sheet("Sheet1").cell("C1").value(`createColumnBy`);
                workbook.sheet("Sheet1").cell("D1").value(`description`);
                workbook.sheet("Sheet1").cell("E1").value(`createdAt`);
                workbook.sheet("Sheet1").cell("F1").value(`updatedAt`);


                let start_row = 2
                for (let i = 1; i <= columns.length; i++) {


                    workbook.sheet("Sheet1").cell("A" + start_row).value(`${colums[i-1].id}`);
                    workbook.sheet("Sheet1").cell("B" + start_row).value(`${colums[i-1].columnName}`);
                    workbook.sheet("Sheet1").cell("C" + start_row).value(`${colums[i-1].createColumnBy}`);
                    workbook.sheet("Sheet1").cell("D" + start_row).value(`${colums[i-1].description}`);


                    workbook.sheet("Sheet1").cell("E" + start_row).value(`${colums[i-1].createdAt}`);
                    workbook.sheet("Sheet1").cell("F" + start_row).value(`${colums[i-1].updatedAt}`);
                    start_row++;

                }



                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/Test/src/excel/ColumnsAll.xlsx");

            });

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
            message: 'Card fails aa'
        }
        return;

    }
    await next()

})





module.exports = router;