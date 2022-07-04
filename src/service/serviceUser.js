import {
    Op,
    literal
} from 'sequelize'
import moment from "moment";
import {
    Db
} from '../models'

const serviceUser = async (ctx) => {
    const {
        userName,
        realName,
        email,
        phoneNumber,
        createdAtFrom,
        createdAtTo,
        createdAt
    } = ctx.query
    let condition = {}
    if (userName) {
        condition.userName = {
            [Op.substring]: userName
        }
    }
    if (realName) {
        condition.realName = {
            [Op.substring]: realName
        }
    }
    if (email) {
        condition.email = {
            [Op.substring]: email
        }
    }
    if (phoneNumber) {
        condition.phoneNumber = {
            [Op.eq]: phoneNumber
        }
    }
    if (createdAt) {
        condition.createdAt_ = Db.where(literal(`"User"."createdAt"`), {
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
    serviceUser
}