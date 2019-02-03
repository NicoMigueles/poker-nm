const sock = io();
sock.emit('mesa', false);

//Botones
const btn_irse = document.getElementById('irse');
const btn_name = document.getElementById('btn_save_name');
//Player info
const nombre = document.getElementById('nombre');
//Cartas
const carta1 = document.getElementById('carta1');
const carta2 = document.getElementById('carta2');

btn_name.addEventListener('click', () => {
  sock.emit('change_name', [sock.id, nombre.value]);
});

btn_irse.addEventListener('click', () => {
  sock.emit('irse', sock.id);
  colocar_carta(carta1,'dorso');
  colocar_carta(carta2,'dorso');
});

sock.on('reparto', (mano) => {
  let primera_carta = carta(mano[0]);
  let segunda_carta = carta(mano[1]);
  colocar_carta(carta1,primera_carta);
  colocar_carta(carta2,segunda_carta);
});

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