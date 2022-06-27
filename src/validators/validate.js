import {
    config
} from 'dotenv'

import Koa from 'koa'
import moment from "moment";
const app = new Koa();

config();

const validateList = async (ctx, next) => {
    const {
        createdAtFrom,
        createdAtTo
    } = ctx.query
    if (createdAtFrom && createdAtTo) {
        let result = moment(createdAtFrom, "YYYY-MM-DD", true).isValid();
        let result1 = moment(createdAtTo, "YYYY-MM-DD", true).isValid();
        if (!result || !result1) {

            ctx.body = {
                message: "Sai định dạng, định dạng phải là YYYY-MM-DD ",

            }
            return
        }
    }
    if (createdAtFrom) {
        let result = moment(createdAtFrom, "YYYY-MM-DD", true).isValid();
        if (!result) {

            ctx.body = {
                message: "Sai định dạng, định dạng phải là YYYY-MM-DD"

            }
            return
        }
    }
    if (createdAtTo) {
        let result = moment(createdAtTo, "YYYY-MM-DD", true).isValid();
        if (!result) {

            ctx.body = {
                message: "Sai định dạng, định dạng phải là YYYY-MM-DD ",

            }
            return
        }
    }

    await next()
}
module.exports = {
    validateList
}