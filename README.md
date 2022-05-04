# Sistemas-Distribuidos
Tareas del Ramo


## Funcionamiento de la APP
Para correr la tarea se requiere contar con Postgrsql, Node, Redis

Se requiere correr el docker-compose para eso se ejecuta:

`sudo docker-compose up`

Luego para utilizar la base de datos se requiere conseguir la ip correspondiente a esta para esto uno ejecuta:

`sudo docker ps`

que nos listara las imagenes que estamos corriendo, luego anotamos la id de el servicio de postgres en bitnami y ejecutamos el codigo:

`sudo docker inspect "ID"`

buscamos la IP y la copiamos para luego pegarla en nuestro servidor ubicado en **/GRPCSERVER/** server.js donde debes reemplazar esta ip por la cual se encuentra puesta en host: "IP"

![no carga la imagen](https://cdn.discordapp.com/attachments/878099236334485504/971260279985954826/ip.png)

Luego guardamos el codigo y corremos nuestro servidor para esto entramos en la carpeta de **/GRPCSERVER** en la terminal y colocamos:

`npm start`

Lo cual iniciara el servidor y quedara atento a las peticiones que se realizen por GRPC, ahora abrimos por consola la carpeta que envuelve todo y corremos el cliente:

`npm start`

Y estara listo para recibir peticiones desde http , insomnia o postman.

## Consultas a la base de datos

Para consultar a la base de datos SQL que maneja nuestro servidor se requiere entrar a la direccion **/items** la cual nos retornara todos los contenidos dentro de la base de datos, para solo ver los items por busqueda deseada se requiere colocar **/items/Gold** siendo "Gold" la palabra a reemplazar para poder buscar dentro de la base. 

Un ejemplo de Busqueda:

`localhost:4000/items/Gold`

## Busquedas utilizando LRU y LFU

Comparamos los tiempos de busqueda utilizando los metodos de LRU y LFU para esto entramos en la consola de nuestro REDIS con el comando:

`redis-cli`

para esto utilizamos los comandos para LRU:

```
config set maxmemory 40M
config set maxmemory-policy allkeys-lru
```

y estos para LFU:

```
config set maxmemory 40M
config set maxmemory-policy volatile-lru
```
Tabla comparativa de tiempos:

|Metodo| Consulta 1| Consulta 2|Consulta 3| Consulta 4|
| -----| ----- | ---- | ----- | ---- |
| LRU| 205.378ms | 5.831ms | 3.491ms | 1.797ms |
| LFU| 144.915ms | 2.340ms | 1.503ms | 7.391ms |

Para este caso y como se puede apreciar en la tabla comparativa recomiendo usar LFU ya que elimina las menos usadas recientemente y esto nos esta dando tiempos de entradas menores a este tipo de consultas a la base de datos.
