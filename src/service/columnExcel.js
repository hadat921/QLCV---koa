import XlsxPopulate from "xlsx-populate";

async function convertColumn(columns) {
    let workbook = await XlsxPopulate.fromBlankAsync();


    workbook.sheet("Sheet1").cell("A1").value("id");
    workbook.sheet("Sheet1").cell("B1").value(`columnName`);
    workbook.sheet("Sheet1").cell("C1").value(`createColumnBy`);
    workbook.sheet("Sheet1").cell("D1").value(`description`);
    workbook.sheet("Sheet1").cell("E1").value(`createdAt`);
    workbook.sheet("Sheet1").cell("F1").value(`updatedAt`);


    let start_row = 2
    for (let i = 1; i <= columns.length; i++) {


        workbook.sheet("Sheet1").cell("A" + start_row).value(`${columns[i-1].id}`);
        workbook.sheet("Sheet1").cell("B" + start_row).value(`${columns[i-1].columnName}`);
        workbook.sheet("Sheet1").cell("C" + start_row).value(`${columns[i-1].createColumnBy}`);
        workbook.sheet("Sheet1").cell("D" + start_row).value(`${columns[i-1].description}`);


        workbook.sheet("Sheet1").cell("E" + start_row).value(`${columns[i-1].createdAt}`);
        workbook.sheet("Sheet1").cell("F" + start_row).value(`${columns[i-1].updatedAt}`);
        start_row++;

    }
    return workbook.outputAsync()
}
export {
    convertColumn,

}