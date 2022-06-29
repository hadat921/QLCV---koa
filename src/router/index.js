import Router from 'koa-router';
import fs from 'fs'
const router = new Router();

fs.readdirSync(__dirname).forEach(function (file) {
    if (file == "index.js")
        return;
    let name = file.substr(0, file.indexOf("."));
    let route = require("./" + name).default;
    router.use(route.routes(), route.allowedMethods());
});
export default router;