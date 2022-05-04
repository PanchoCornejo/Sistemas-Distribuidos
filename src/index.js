const express = require("express");
const responseTime = require("response-time");

const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(responseTime());
//Routes
app.use(require('./routes/index'));

async function main() {
    app.listen(4000);
    console.log("server listen on port 4000");
  }
  
main();
  