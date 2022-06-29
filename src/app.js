import koaBody from "koa-body";
import routes from './router'
import bodyParser from 'koa-bodyparser';
import Koa from 'koa'
import {
    getEnv
} from "../src/config/index"


let app = new Koa();
import logger from 'koa-logger'
app.use(koaBody({
    multipart: true
}))
app.use(logger())
app.use(bodyParser({
    enableTypes: ['json'],
    extendTypes: ['application/json'],
}));
app
    .use(routes.routes())
    .use(routes.allowedMethods())

let PORT = getEnv("PORT")
app.listen(PORT, () => console.log("Server running on PORT: " + PORT));