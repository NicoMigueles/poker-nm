const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);
let i = 0;


let conectados = [];
io.on('connection', (sock) => {
  let mesa = false;
  let p = null;

  // Busca si es un jugador o una mesa.
  sock.on('mesa', (v) => {
    mesa = v;
    if(mesa === false){
      i++;
      p = new Jugador(i);
      p.id = sock.id;
      console.log(p.nombre + ' se ha conectado.')
      conectados.push(p);
    }else{
      console.log('Mesa cargada.');
    }
    refresh_mesa();
  });
  sock.on('reparto', (nada) => {
    var c = mesclar(conectados.length);
    var c_players = c[0];
    var c_mesa = c[1];
    for(let m = 0; m < conectados.length; m++){
      let id = conectados[m]['id'];
      io.to(id).emit('reparto', c_players[m]);
      console.log(c_players[m] + ' para el jugador ' + conectados[m]['nombre']);
    }
    io.emit('loadMesa', c_mesa);
    refresh_mesa();
    
  });
  sock.on('irse', (id)=>{
    let name = '';
    for(let m = 0; m < conectados.length; m++){
      if(conectados[m]['id'] === id){
        name = conectados[m]['nombre'];
      }
    }    
    io.emit('se_fue' , name);
  });
  sock.on('change_name', (arr)=>{
    let id = arr[0];
    let new_name = arr[1];
    for(let m = 0; m < conectados.length; m++){
      if(conectados[m]['id'] === id){
        console.log(conectados[m]['nombre']+' cambio su nombre => '+new_name);
        conectados[m]['nombre'] = new_name;
      }
    }
    refresh_mesa();
  });
  sock.on('message', (text) => {
      console.log(text);  
  });
  sock.on('disconnect', function() {
    p === null ? mesa = true : void  0; // evita las reconexiones accidentales.
    if(!mesa){
      var indice = conectados.indexOf(p)
      conectados.splice(indice, 1);
      console.log(p.nombre + ' se ha desconectado.')
      i--;
      refresh_mesa();
    }
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('Servidor Iniciado');
  console.log('http://localhost:8080');
});

class Jugador {
  constructor(i) {
      this.nombre = String('Player' + i);
  }
}
function mesclar(num_players){
  let mazo = ['AP','2P','3P','4P','5P','6P','7P','8P','9P','10P','JP','QP','KP',
              'AC','2C','3C','4C','5C','6C','7C','8C','9C','10C','JC','QC','KC',
              'AT','2T','3T','4T','5T','6T','7T','8T','9T','10T','JT','QT','KT',
              'AD','2D','3D','4D','5D','6D','7D','8D','9D','10D','JD','QD','KD',];
  let mazo_mesclado = shuffle(mazo);
  var temp_i = 0
  var duplas = [];
  var cartas_mesa = [];
  for(let j = 0; j < num_players; j++){
      duplas.push([mazo_mesclado[temp_i],mazo_mesclado[temp_i+1]]);
      temp_i = temp_i + 2;
  }
  for(let j = 0; j < 5; j++){
      cartas_mesa.push(mazo_mesclado[temp_i]);
      temp_i++;
  }
  return [duplas,cartas_mesa]
}
function shuffle(arr) {
  var i,
      j,
      temp;
  for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
  return arr;    
};
function refresh_mesa(){
  io.emit('refresh', conectados);
}