import {
    Op
} from 'sequelize'

import moment from "moment";

const serviceColumn = async (ctx) => {
    const {
        columnName,
        createColumnBy,
        createdAtFrom,
        createdAtTo
    } = ctx.query
    let condition = {}

    if (columnName) {
        condition.columnName = {
            [Op.iLike]: `%${columnName}%`
        }
    }
    if (createColumnBy) {
        condition.createColumnBy = {
            [Op.eq]: createColumnBy
        }
    }
    if (createdAtFrom && createdAtTo) {
        const from = moment(createdAtFrom).startOf('day').format("YYYY-MM-DD HH:mm:ss")
        const to = moment(createdAtTo).endOf('day').format("YYYY-MM-DD HH:mm:ss")

        condition.createdAt = {
            [Op.between]: [from, to]
        }
    }
    if (createdAtFrom) {

        const from = moment(createdAtFrom).startOf('day').format("YYYY-MM-DD HH:mm:ss")

        condition.createdAt = {
            [Op.gte]: from
        }
    }
    if (createdAtTo) {
        const to = moment(createdAtTo).endOf('day').format("YYYY-MM-DD HH:mm:ss")

        condition.createdAt = {
            [Op.lte]: to
        }
    }
    return condition;
}

export {
    serviceColumn
}