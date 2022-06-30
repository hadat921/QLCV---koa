import moment from "moment";

const validateList = async (ctx, next) => {
    const {
        createdAtFrom,
        createdAtTo,
        createdAt
    } = ctx.query
    if (createdAt) {
        let result = moment(createdAtFrom, "YYYY-MM-DD", true).isValid();
        if (!result) {

            ctx.body = {
                message: "Incorrect format, format should be YYYY-MM-DD11",
                success: false

            }
        }

    }
    if (createdAtFrom && createdAtTo) {
        let result = moment(createdAtFrom, "YYYY-MM-DD", true).isValid();
        let result1 = moment(createdAtTo, "YYYY-MM-DD", true).isValid();
        if (!result || !result1) {

            ctx.body = {
                message: "Incorrect format, format should be YYYY-MM-DD ",
                success: false
            }
            return
        }
    }
    if (createdAtFrom) {
        let result = moment(createdAtFrom, "YYYY-MM-DD", true).isValid();
        if (!result) {

            ctx.body = {
                message: "Incorrect format, format should be YYYY-MM-DD11",
                success: false

            }
            return
        }
    }
    if (createdAtTo) {
        let result = moment(createdAtTo, "YYYY-MM-DD", true).isValid();
        if (!result) {

            ctx.body = {
                message: "Incorrect format, format should be YYYY-MM-DD22",
                success: false

            }
            return
        }
    }

    await next()
}
export {
    validateList
}