import Parameter from 'parameter';
var parameter = new Parameter({
    validateRoot: true,
});

const validatorRegister = async (ctx, next) => {
    try {
        var data = ctx.request.body;
        var rule = {
            userName: {
                type: "string",
                required: true,
                allowEmpty: false,
                min: 6,
                max: 50,
            },
            password: {
                type: "password",
                required: true,
                allowEmpty: false,
                min: 6,
                max: 50
            },
            phoneNumber: {
                type: "string",
                required: true,
                allowEmpty: false,
            },
            email: {
                type: "email",
                required: false,
                allowEmpty: false,
            },

        };
        var errors = parameter.validate(rule, data);
        if (errors) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: errors
            }
            return;
        }
        await next()
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: " Internal Server Error"
        }
    }
}
const validateLogin = async (ctx, next) => {
    try {
        var data = ctx.request.body;
        var rule = {
            userName: {
                type: "string",
                required: true,
                allowEmpty: false,
                min: 6,
                max: 50,
            },
            password: {
                type: "password",
                required: true,
                allowEmpty: false,
                min: 6,
                max: 50
            }

        };
        var errors = parameter.validate(rule, data);
        if (errors) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: errors
            }
            return;
        }
        await next()
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: " Internal Server Error"
        }
    }
}

export {

    validatorRegister,
    validateLogin
}