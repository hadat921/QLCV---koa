import {
    Op,
    literal
} from 'sequelize'
import moment from "moment";
import {
    Db
} from '../models'

const serviceCard = async (ctx) => {
    const {
        idColumn,
        cardName,
        createdAtFrom,
        createdAtTo,
        createdAt
    } = ctx.query
    let condition = {}
    if (idColumn) {
        condition.idColumn = {
            [Op.eq]: idColumn
        }
    }
    if (cardName) {
        condition.cardName = {
            [Op.iLike]: `%${cardName}%`
        }
    }
    if (createdAt) {
        condition.createdAt_ = Db.where(literal(`"Card"."createdAt"`), {
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
    serviceCard
}