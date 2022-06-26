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
 }

 function executar(resposta){
    console.log(resposta);
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
        const  mensagemStatus=`<div class="status mensagem" id="nickName" onclick="falarComAPessoa(this)"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>${objDetalhes[i].text}</h2></div>`
        corpo.innerHTML += mensagemStatus;
      } else if(objDetalhes[i].type=="private_message"){
         const mensagemPrivada= `<div class="chat-privado mensagem" id="nickName" onclick="falarComAPessoa(this)"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>reservadamente para </h2><h1>${objDetalhes[i].to}</h1><h2>${objDetalhes[i].text}</h2></div>`

      }else{
        const mensagens= `<div class="chat-publico mensagem" id="nickName" onclick="falarComAPessoa(this)"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>para</h2><h1>${objDetalhes[i].to}</h1><h2>${objDetalhes[i].text}</h2></div>`
        corpo.innerHTML += mensagens;
  }}
   const ultimaMensagem =document.querySelector(".mensagem:last-child");
   ultimaMensagem.scrollIntoView();
}

function novaMensagem(el){
   const novasMensagens = document.querySelector(".input-mensagem").value;
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
 console.log(erro);
 alert("Deu erro ai")
}

/*
function falarComAPessoa(elemento){
   let nick=document.getElementById("nickName");
   console.log(nick);
   document
   
}*/