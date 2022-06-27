let nome;

let corpo = document.querySelector(".corpo");
corpo.innerHTML = "";

let dataAtual = new Date();
let horas = dataAtual.getHours();
horas=horas-9;
let minutos = dataAtual.getMinutes();
let segundos =dataAtual.getSeconds();

 function entrar(el){ //VRIFICA SE OS USUÁRIOS SÃO DIFERENTES  \\falta terminar colocando um loop para caso de usuários com nome iguais
    nome = document.querySelector(".input-usuario").value;
    nomeObj= {name: nome};

    let promessa= axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",nomeObj);
    promessa.then(executar);
    promessa.catch(EscolherOutroNome);
 }
 function EscolherOutroNome(resposta){
  // console.log(resposta);
   if(resposta.response.status===400){
   alert("Esse nome já está em uso por favor escolha outro");}
 }

 function executar(resposta){
  //  console.log(resposta);
    usuario=resposta.data;
    document.querySelector(".tela-inicial").classList.add("esconder");
    agoraPodeEntrar();
    setInterval(verificaOnline,3000);
 }

function verificaOnline(){
   let usuarioOnline ={ name: nome};
   axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuarioOnline);
}

function agoraPodeEntrar(){    
   document.querySelector(".corpo").classList.remove("esconder");
   document.querySelector(".topo").classList.remove("esconder");
   document.querySelector(".bot").classList.remove("esconder");
   buscarMensagens();
} 

function buscarMensagens(){
   let carregarmensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
   carregarmensagens.then(iniciarBatePapo);
}

function iniciarBatePapo(detalhes){ //IDENTIFICO O OBJETO
  objDetalhes=detalhes.data;
  entrou();
  publicarMensagens();
  setInterval(buscarMensagens,4500);
}

function entrou(){
   corpo.innerHTML="";
   corpo.innerHTML += `<div class="status mensagem"><h6>(${horas.toPrecision(2)}:${minutos.toPrecision(2)}:${segundos.toPrecision(2)})</h6><h1>${nome}</h1><h2>entrou na sala...</h2></div>`;
}

function publicarMensagens(){
   for(let i=0; i<objDetalhes.length; i++){
      
      if(objDetalhes[i].type=="status"){
        const  mensagemStatus=`<div class="status mensagem"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>${objDetalhes[i].text}</h2></div>`
        corpo.innerHTML += mensagemStatus;
      } else if(objDetalhes[i].type=="private_message" && objDetalhes[i].to === nome){
         const mensagemPrivada= `<div class="chat-privado mensagem"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>reservadamente para </h2><h1>${objDetalhes[i].to}</h1><h2>${objDetalhes[i].text}</h2></div>`
         corpo.innerHTML += mensagemPrivada;      
      }else{
        const mensagens= `<div class="chat-publico mensagem"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>para</h2><h1>${objDetalhes[i].to}</h1><h2>${objDetalhes[i].text}</h2></div>`
        corpo.innerHTML += mensagens;
      }
   }  
   const ultimaMensagem =document.querySelector(".mensagem:last-child");
   ultimaMensagem.scrollIntoView();
}

function novaMensagem(el){
   let novasMensagens = document.querySelector(".input-mensagem").value;
   let upmensagem={
      from: nome,
	   to: "Todos",
	   text: novasMensagens,
   	type: "message"
   }

   promise=axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",upmensagem);
   promise.then(buscarMensagens);
   promise.catch(alertar);
}

function alertar(erro){
 console.log("ERROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO" + erro);
 alert("Deu erro ai "+ erro );
 window.location.reload();
}

/*************************************************  BOTOES BONUS **************************************************/
let contatos;
let nickName;

function verParticipantes(el){
   document.querySelector(".participantes").classList.add("mostrar");
   document.querySelector(".divisao").classList.remove("esconder");
   BuscarParticipantes();
}

function voltarChat(el){
   el.classList.add("esconder");
   document.querySelector(".participantes").classList.remove("mostrar");
}

function BuscarParticipantes(){
   promessa=axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
   promessa.then(carregarUsuarios);
}
function carregarUsuarios(resposta){
   contatos=resposta.data
   console.log(contatos);
   verUsuarios();
}

let TodosContatos=document.querySelector(".todosContatos");
function verUsuarios(){
   for(let i=0;i<contatos.length;i++){
      const listaContatos= `<div class="contatos"><ion-icon class="iconeBonus" name="person-circle-sharp"></ion-icon><h5 onclick="selecionarChat(this)"> ${contatos[i].name}</h5><ion-icon name="checkmark-sharp" class="ok esconder"></ion-icon> `
     // console.log(contatos[i].name);
      TodosContatos.innerHTML += listaContatos;
   }
}

function selecionarChat(el){
   nickName = el.innerHTML;
   console.log(nickName);
   //chatPrivado();

}
/*
function chatPrivado(){
   let novasMensagens = document.querySelector(".input-mensagem").value;
   let upmensagem={   
      from: nome,
      to: nickName,
      text: novasMensagens,
      type: "private_message"
   }
   promise=axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",upmensagem);
   promise.then(buscarMensagens);
   promise.catch(alertar);
}*/
   

