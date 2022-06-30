const validatecolumns = async (ctx, next) => {
    const {
        columnName,
    } = ctx.request.body;
    if (!columnName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "colums fails"
        }
        return;
    }
    await next()
}
export {
    validatecolumns
}