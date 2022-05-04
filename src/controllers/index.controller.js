// Cosas del Cliente GRPC

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
var PROTO_PATH = __dirname + '/example.proto';
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const ItemService = grpc.loadPackageDefinition(packageDefinition).ItemService;
const clienteGRPC = new ItemService("localhost:50051", grpc.credentials.createInsecure());

//module.exports = clientGRPC;


//Cosas del Redis
const express = require("express");
const { createClient } = require("redis");
const responseTime = require("response-time");
const app = express();
// Connecting to redis
const client = createClient({
    host: "127.0.0.1",
    port: 6379,
  });
app.use(responseTime());

async function main(){
  await client.connect();
}
main();


// Devolviendo toda la base de datos

const getItems = async (req, res) => {
    console.log('buscando por ID');
    clienteGRPC.GetItem({name: 'todo'}, function(err,Item){
        console.log('Verificando', Item);
      });
    res.json(clienteGRPC);
};

// devolviendo la busqueda pedida

const getItemsID = async (req, res) => {
  var id = req.params.id;
  try{
    //buscamos la data en Redis
    const reply = await client.get(id);
    // si existe lo retorna desde Redisy finaliza la respuesta
    if (reply) return res.send(JSON.parse(reply));
    // Sino esta retornamos desde la base de datos
    console.log('buscando por ID');
    const response = clienteGRPC.GetItem({name: id }, function(err,Item){
    console.log('Verificando', Item);
    });
    console.log('se supone que debemos tener algo');
    // Probando ya que no se puede sacar la peticion
    const prueba = {
      id : 1,
      name : 'Pancho',
      price : 455,
      category : 'Gamer',
      count : 5
    };
    // guardando los Resultados en REDIS
    console.log('Comenzando a subir la info');
    const saveresult = await client.set(id,JSON.stringify(prueba), function(err,reply){ console.log(reply)});
    console.log('SE GUARDA: ' + saveresult);
    // respondemos al Cliente
    res.json(hola);
  } catch (error){
    res.send(error.message);
  }
};

module.exports = {
    getItems,
    getItemsID
};