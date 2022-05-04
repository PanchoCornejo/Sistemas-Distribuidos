const express = require("express");


const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Routes
app.use(require('./routes/index'));

async function main() {
    app.listen(4000);
    console.log("server listen on port 4000");
  }
  
main();
  