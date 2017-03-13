const Koa = require('koa');
const app = new Koa();
const enforceHttps = require('koa-sslify');

console.log("ENV: ", process.env.NODE_ENV);

if (process.env.NODE_ENV == 'production') {
  app.use(enforceHttps({ trustProtoHeader: true }));
}

app.use(ctx => {
  ctx.body = 'Survey';
});

const portval = process.env.PORT || 3001

app.listen(portval);
app.port = 18000;
app.timeout = 10000;
/**
* Expose it
*/
module.exports = app;