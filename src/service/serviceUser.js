import {
    Op
} from 'sequelize'
import moment from "moment";

const serviceUser = async (ctx) => {
    const {

        userName,
        realName,
        email,
        phoneNumber,
        createdAtFrom,
        createdAtTo
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
export default {
    serviceUser
}