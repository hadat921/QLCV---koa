import emailvalidator from "email-validator"
const validateAuth = async (ctx, next) => {
    const {
        userName,
        password,
        phoneNumber,
        email
    } = ctx.request.body
    const emailValid = emailvalidator.validate(email)
    if (!userName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Missing username"
        }
        return;
    }
    if (userName.length > 50) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Account must not exceed 50 characters"
        }
        return;
    }
    if (!password) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Missing password"

        }
        return;
    }

    if (!phoneNumber) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Missing phonenumber"
        }
        return;
    }
    if (!email) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Missing email"
        }
        return;
    }

    if (!emailValid) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Wrong format"
        }
        return;
    }
    await next()
}
const validateLogin = async (ctx, next) => {
    const {
        userName,
        password,
    } = ctx.request.body
    if (!userName) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Missing userName"
        }
        return;
    }
    if (userName.length > 50) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Account must not exceed 50 characters"
        }
        return;
    }
    if (!password) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: "Missing passWord"

        }
        return;
    }
    await next()

}

export {
    validateAuth,
    validateLogin
}