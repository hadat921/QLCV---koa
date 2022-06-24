import XlsxPopulate from "xlsx-populate";

async function convertCard(card) {
    let workbook = await XlsxPopulate.fromBlankAsync();

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

    return workbook.outputAsync()

}

async function convertCardID(card) {
    let workbook = await XlsxPopulate.fromBlankAsync();
    XlsxPopulate.fromBlankAsync()
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
    return workbook.outputAsync()


}

module.exports = {
    convertCard,
    convertCardID
}
// Write to file.