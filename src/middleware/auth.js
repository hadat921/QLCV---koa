import jwt from "jsonwebtoken"
import {
    getEnv
} from "../config/index"

const verifyToken = async (ctx, next) => {

    const {
        authorization
    } = ctx.header;


    if (!authorization) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            message: 'Access Token not found'
        }
        return;
    }

    try {
        const decoded = jwt.verify(authorization, getEnv("ACESS_TOKEN_SECRET"))

        ctx.state.user = {
            id: decoded.payload
        };

    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'AccessToken missing'
        }
        return;

    }
    await next()
}
export default verifyToken