import Parameter from 'parameter';

var parameter = new Parameter({
    validateRoot: true,
});

const validatorColumn = async (ctx, next) => {
    try {
        var data = ctx.request.body;
        console.log(data);

        var rule = {
            columnName: {
                type: "string",
                required: true,
                allowEmpty: false,
            },
            description: {
                type: "string",
                required: true,
                allowEmpty: false,
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
const validatorListColumn = async (ctx, next) => {
    try {
        var data = ctx.request.query;
        var rule = {
            columnName: {
                type: "string",
                required: false,
                allowEmpty: false,
            },
            createColumnBy: {
                type: "id",
                required: false,
                allowEmpty: false,
            },
            createdAtFrom: {
                type: "date",
                required: false,
                allowEmpty: false,
            },
            createdAt: {
                type: "date",
                required: false,
                allowEmpty: false,
            },
            createdAtTo: {
                type: "date",
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
export {
    validatorColumn,
    validatorListColumn
}