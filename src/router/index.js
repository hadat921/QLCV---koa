const fs = require("fs");
const Router = require("koa-router");
const router = new Router();

fs.readdirSync(__dirname).forEach(function (file) {
    if (file == "index.js")
        return;
    let name = file.substr(0, file.indexOf("."));
    let route = require("./" + name);
    router.use(route.routes(), route.allowedMethods());


});

module.exports = router;