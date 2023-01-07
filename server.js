

const mongo = require('mongoose')
const app = require('./practice')
const dotenv = require('dotenv')
dotenv.config({
  path: './config.env'
})

// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongo
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(con => {
    // console.log(con.connectaions);
    console.log('connected with moongoses');
  })





const port = 4000
app.listen(port, () => {
  console.log('the server has been started');
})