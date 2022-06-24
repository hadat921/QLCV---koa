import {
    Op
} from 'sequelize'
import _ from 'lodash'
import moment from "moment";


const serviceCard = async (condition, ctx) => {
    const {
        idColumn,
        cardName,
        createdAtFrom,
        createdAtTo
    } = ctx.query
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


module.exports = {
    serviceCard
}