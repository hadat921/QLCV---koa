import XlsxPopulate from "xlsx-populate";



async function convertUser(user) {
    let workbook = await XlsxPopulate.fromBlankAsync();

    workbook.sheet("Sheet1").cell("A1").value("id");
    workbook.sheet("Sheet1").cell("B1").value("userName");
    workbook.sheet("Sheet1").cell("C1").value("realName");
    workbook.sheet("Sheet1").cell("D1").value("email");
    workbook.sheet("Sheet1").cell("E1").value("avtar");
    workbook.sheet("Sheet1").cell("F1").value("phoneNumber");
    workbook.sheet("Sheet1").cell("G1").value("createdAt");
    workbook.sheet("Sheet1").cell("H1").value("updatedAt");

    let start_row = 2
    for (let i = 1; i <= user.length; i++) {


        workbook.sheet("Sheet1").cell("A" + start_row).value(`${user[i-1].id}`);
        workbook.sheet("Sheet1").cell("B" + start_row).value(`${user[i-1].userName}`);
        workbook.sheet("Sheet1").cell("C" + start_row).value(`${user[i-1].realName}`);
        workbook.sheet("Sheet1").cell("D" + start_row).value(`${user[i-1].email}`);
        workbook.sheet("Sheet1").cell("E" + start_row).value(`${user[i-1].avatar}`);
        workbook.sheet("Sheet1").cell("F" + start_row).value(`${user[i-1].phoneNumber}`);
        workbook.sheet("Sheet1").cell("G" + start_row).value(`${user[i-1].createdAt}`);
        workbook.sheet("Sheet1").cell("H" + start_row).value(`${user[i-1].updatedAt}`);
        start_row++;

    }




    return workbook.outputAsync()






}
async function convertUserbyId(user) {
    let workbook = await XlsxPopulate.fromBlankAsync();


    workbook.sheet("Sheet1").cell("A1").value("id");
    workbook.sheet("Sheet1").cell("B1").value("userName");
    workbook.sheet("Sheet1").cell("C1").value("realName");
    workbook.sheet("Sheet1").cell("D1").value("email");
    workbook.sheet("Sheet1").cell("E1").value("avtar");
    workbook.sheet("Sheet1").cell("F1").value("phoneNumber");
    workbook.sheet("Sheet1").cell("G1").value("createdAt");
    workbook.sheet("Sheet1").cell("H1").value("updatedAt");

    workbook.sheet("Sheet1").cell("A2").value(`${user.dataValues.id}`);
    workbook.sheet("Sheet1").cell("B2").value(`${user.dataValues.userName}`);
    workbook.sheet("Sheet1").cell("C2").value(`${user.dataValues.realName}`);
    workbook.sheet("Sheet1").cell("D2").value(`${user.dataValues.email}`);
    workbook.sheet("Sheet1").cell("E2").value(`${user.avatar}`);
    workbook.sheet("Sheet1").cell("F2").value(`${user.phoneNumber}`);
    workbook.sheet("Sheet1").cell("G2").value(`${user.createdAt}`);
    workbook.sheet("Sheet1").cell("H2").value(`${user.updatedAt}`);
    return workbook.outputAsync()
}










module.exports = {
    convertUser,
    convertUserbyId
}