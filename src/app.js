// const config = require('config')
import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import config from './config';
import router from './router';
import db from './middleware/database';
import koaValidator from 'koa-async-validator';
import { isUndefined } from 'util';
import token from '../utils/auth'



console.info(`ROOT_PATH: ${config.ROOT_PATH}`);

const app = new Koa();
// app.use(validate)
// sequelize & squel
app.use(db);
app.use(koaValidator())
// rest logger
app.use(logger());
app.use(bodyParser());

// x-response-time
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async function (ctx, next) {
  if (ctx.request.method === 'PUT') {
    if (!isUndefined(ctx.header.authorization)) {
      try {
        let data = await token.decodeToken(ctx.header.authorization)
        if (data === null) {
          ctx.status = 401;
          ctx.body = { msg: 'Token Invalido' }
        }else{
          await next()
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("No esta autorizado")
      ctx.status = 401;
      ctx.body = { msg: 'You dont have access to update, please login first' }
    }
  } else {
    await next()
  }
})

app.use(async function (ctx, next) {
  if (ctx.request.method === 'PUT' || ctx.request.method === 'POST') {
    ctx.checkBody('name', 'Name its required').notEmpty()
    ctx.checkBody('email', 'Email invalid').isEmail()
    let errors = await ctx.validationErrors();
    if (errors.length > 0) {
      console.log(errors[0].msg)
      ctx.status = 400;
      ctx.body = { msg: errors[0].msg }
    } else {
      await next();
    }
  } else {
    await next();
  }
});

app.use(router());

app.listen(process.env.PORT || 3000);
console.info(`Node ${process.version} : ${config.NODE_ENV} listening on port ${process.env.PORT || 3000}`);
