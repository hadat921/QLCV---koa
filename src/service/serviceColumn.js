import {
    Op,
    literal
} from 'sequelize'
import {
    Db
} from '../models'
import moment from "moment";

const serviceColumn = async (ctx) => {
    const {
        columnName,
        createColumnBy,
        createdAtFrom,
        createdAtTo,
        createdAt
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
    if (createdAt) {
        condition.createdAt_ = Db.where(literal(`"Column"."createdAt"`), {
            [Op.between]: [
                moment(createdAt).startOf('dates').format("YYYY-MM-DD HH:mm:ss"),
                moment(createdAt).endOf('dates').format("YYYY-MM-DD HH:mm:ss")
            ]
        })
    }
    if (createdAtFrom || createdAtTo) {
        if (createdAtTo) {

            const to = moment(createdAtTo).endOf('day').format("YYYY-MM-DD HH:mm:ss")

            condition.createdAt = {
                [Op.lte]: to
            }
        }
        if (createdAtFrom) {

            const from = moment(createdAtFrom).startOf('day').format("YYYY-MM-DD HH:mm:ss")

            condition.createdAt = {
                [Op.gte]: from
            }
        }
        if (createdAtFrom && createdAtTo) {
            const from = moment(createdAtFrom).startOf('day').format("YYYY-MM-DD HH:mm:ss")
            const to = moment(createdAtTo).endOf('day').format("YYYY-MM-DD HH:mm:ss")
            condition.createdAt = {
                [Op.between]: [from, to]
            }

        }
    }

    return condition;
}

export {
    serviceColumn
}