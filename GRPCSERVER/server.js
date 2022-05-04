const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

/* Conexion con la base*/
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '172.25.0.2',
    password: 'marihuana',
    database: 'tiendita',
    port: '5432'
});

const PROTO_PATH = "./example.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const itemProto = grpc.loadPackageDefinition(packageDefinition);


async function buscador(aux){
  //busqueda Real SQL
  if (aux=='todo'){
    console.log('entraste a todo');
    const datos = await pool.query('SELECT * FROM items');
    console.log(datos.rows);
    return(datos);
  } else {
    console.log('entraste a: ' + aux);
    const datos = await pool.query('SELECT * FROM items WHERE name LIKE $1',['%'+aux+'%']);
    console.log(datos.rows);
    return (datos.rows);
  }
};

async function getItem (_, callback)  {
  //requerimos el item a buscar por lo que usamos _.request.name
  const itemName = _.request.name;
  //corremos la funcion Callback
  const valores = await buscador(itemName);
  console.log('nos llega....'+ valores[0].name);
  const prueba = {
    id : 1,
    name : 'Pancho',
    price : 455,
    category : 'Gamer',
    count : 5
  };
  const prueba2 = [{
    id : 1,
    name : 'Pancho',
    price : 455,
    category : 'Gamer',
    count : 5
  },{
    id : 2,
    name : 'Ignacio',
    price : 455,
    category : 'Gamer',
    count : 6
  }
  ];
  const prueba3 = JSON.stringify(prueba);
  console.log('Convertido a JSON: ' + prueba3)
  callback(null, prueba);
};

function main(){
    const server = new grpc.Server();
    server.addService(itemProto.ItemService.service,{getItem: getItem});
    server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) console.log(err);
    else {
      console.log("GRPC SERVER RUN AT http://localhost:50051");
      server.start();
    }
  });
}
  
main();