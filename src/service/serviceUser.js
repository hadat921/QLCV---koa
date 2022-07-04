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
        createdAt,
        state
    } = ctx.query
    let condition = {}
    if (userName) {
        condition.userName = {
            [Op.iLike]: `%${userName}%`
        }
    }
    if (realName) {
        condition.realName = {
            [Op.iLike]: `%${realName}%`
        }
    }
    if (email) {
        condition.email = {
            [Op.iLike]: `%${email}%`
        }
    }
    if (phoneNumber) {
        condition.phoneNumber = {
            [Op.eq]: phoneNumber
        }
    }
    if (state) {
        condition.state = {
            [Op.eq]: state
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