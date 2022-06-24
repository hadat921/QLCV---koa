require('dotenv').config()
import koaBody from "koa-body";
import routes from './router'
import bodyParser from 'koa-bodyparser';
import Koa from 'koa'

let app = new Koa();
const logger = require('koa-logger');

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

app.listen(PORT, () => console.log("server chay tren cong hi:" + PORT));

function getEnv(bien) {
    return process.env[bien]
}