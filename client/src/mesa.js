const sock = io();
sock.emit('mesa', true);

//Botones
const btn_mostar = document.getElementById('mostrar'); 
const btn_repartir = document.getElementById('rep');
//Cartas
const carta1 = document.getElementById('carta1');
const carta2 = document.getElementById('carta2');
const carta3 = document.getElementById('carta3');
const carta4 = document.getElementById('carta4');
const carta5 = document.getElementById('carta5');


btn_repartir.addEventListener('click', () => {
    sock.emit('reparto', '');
});
btn_mostar.addEventListener('click', () => {
    mostrar_mesa();
});

btn_mostar.disabled = true;

var m1 = false;
var m2 = false;
var m3 = false;
var cartas_temp = [];

sock.on('loadMesa', (cartas) => {
    cartas_temp = cartas;
    repartir_mesa(cartas);
    sock.emit('message', 'Cartas en la mesa: '+cartas);
}); 

sock.on('se_fue', (name) =>{
    for(let i=0; i< 4;i++){
        const player = document.getElementById('player'+ String(i+1));
        if (player.innerHTML === '<span class="name">'+ name +'</span> <span class="turno">•</span>'){
            player.innerHTML = '<span class="name"><strike>'+ name +'</strike></span> <span class="turno">•</span>';
        }
    }
});

sock.on('refresh', (conectados) =>{
    let num_jugadores = conectados.length;

    for(let i=0; i< 4;i++){
        const player = document.getElementById('player'+ String(i+1));
        if (conectados[i] === undefined){
            player.innerHTML = '';
        }else{
            player.innerHTML = '<span class="name">'+ conectados[i]['nombre'] +'</span> <span class="turno">•</span>';
        }
    }
});

function mostrar_mesa(){ 
    if (m1 === false){
        m1 = true;
        colocar_carta(carta1,carta(cartas_temp[0]));
        colocar_carta(carta2,carta(cartas_temp[1]));
        colocar_carta(carta3,carta(cartas_temp[2]));
    }else if(m2 === false && m1 === true){
        m2 = true;
        colocar_carta(carta4,carta(cartas_temp[3]));
    }else if(m3 === false && m2 === true && m1 === true){
        colocar_carta(carta5,carta(cartas_temp[4]));
        btn_mostar.disabled = true;
    }
}
function repartir_mesa(cartas){
    m1 = false;
    m2 = false;
    m3 = false;
    btn_mostar.disabled = false;
    colocar_carta(carta1,'dorso');
    colocar_carta(carta2,'dorso');
    colocar_carta(carta3,'dorso');
    colocar_carta(carta4,'dorso');
    colocar_carta(carta5,'dorso');
}
function carta(str){
    let index = str.length;
    let palo = str.substr(index-1);
    let tipo = str.slice(0, index-1);
    return [palo,tipo];
} 
function colocar_carta(c,arr){
  //arr = [palo,numero]
    let card = '';
    if(arr === 'dorso'){
        card  = '<div class="carta d"><div class="carta-miolo dorso"><p>扑</p><p>克</p></div></div>';
        c.innerHTML = card;
        return;
    }
    let simbolo = '';
    let color = '';
    switch(arr[0]){
      case 'P':
        simbolo = "♠";
        color = "black";
        break;
      case 'T':
        simbolo = "♣";
        color = "black";
        break;
      case 'C':
        simbolo = "♥";
        color = "red";
        break;
      case 'D':
        simbolo = "♦";
        color = "red";
        break;
      default:
        simbolo = "ERROR";
        break;
    }
    card = '<div class="carta '+color+'"><div class="naip-area naip-top"><span class="naip-number">'+arr[1]+'</span><span class="naip-sign">'+simbolo+'</span></div><div class="naip-area naip-bottom"><span class="naip-number">'+arr[1]+'</span><span class="naip-sign">'+simbolo+'</span></div><div class="carta-miolo miolo-1"><span>'+simbolo+'</span></div></div>';
    c.innerHTML = card;
}