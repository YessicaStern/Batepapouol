let nome;
let contatos;
let corpo = document.querySelector(".corpo");
corpo.innerHTML = "";

 function entrar(){ //VRIFICA SE OS USUÁRIOS SÃO DIFERENTES  \\falta terminar colocando um loop para caso de usuários com nome iguais
    nome = document.querySelector(".input-usuario").value;
    nomeObj= {name: nome};
    let promessa= axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",nomeObj);
    promessa.then(executar);
    promessa.catch(EscolherOutroNome);

    document.querySelector(".botao-entrar").classList.add("esconder");
    document.querySelector(".input-usuario").classList.add("esconder");
    document.querySelector(".reloginho").classList.remove("esconder");
 }

 function EscolherOutroNome(resposta){
   if(resposta.response.status===400){
   alert("Esse nome já está em uso por favor escolha outro");
   window.location.reload();}
 }

 function executar(resposta){
    usuario=resposta.data;
    setTimeout (renovarHTML,1000);
    setInterval(buscarMensagens,3000);
    setInterval(verificaOnline,4000);
    
 }

function renovarHTML(){
   document.querySelector(".tela-inicial").classList.add("esconder");
   document.querySelector(".corpo").classList.remove("esconder");
   document.querySelector(".topo").classList.remove("esconder");
   document.querySelector(".bot").classList.remove("esconder");
}

function verificaOnline(){
   let usuarioOnline ={ name: nome};
   axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuarioOnline);
}

function buscarMensagens(){
   let carregarmensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
   carregarmensagens.then(iniciarBatePapo);
}

function iniciarBatePapo(detalhes){ //IDENTIFICO O OBJETO
  objDetalhes=detalhes.data;
  publicarMensagens();
}

function publicarMensagens(){
 corpo.innerHTML="";
   for(let i=0; i<objDetalhes.length; i++){
      
      if(objDetalhes[i].type=="status"){
        const  mensagemStatus=`<div class="status mensagem"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>${objDetalhes[i].text}</h2></div>`
        corpo.innerHTML += mensagemStatus;}
      if(objDetalhes[i].type=="private_message" && ( objDetalhes[i].to === nome ||  objDetalhes[i].from ===nome)){
         const mensagemPrivada= `<div class="chat-privado mensagem"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>reservadamente para </h2><h1>${objDetalhes[i].to}</h1><h2>${objDetalhes[i].text}</h2></div>`
         corpo.innerHTML += mensagemPrivada;}     
      if(objDetalhes[i].type=="message"){
        const mensagens= `<div class="chat-publico mensagem"><h6>(${objDetalhes[i].time})</h6><h1>${objDetalhes[i].from}</h1><h2>para</h2><h1>${objDetalhes[i].to}</h1><h2>${objDetalhes[i].text}</h2></div>`
        corpo.innerHTML += mensagens;
      }
   }  
   const ultimaMensagem =document.querySelector(".mensagem:last-child");
   ultimaMensagem.scrollIntoView();
}
let upmensagem;
let nickName="Todos";
let tipoMensagem="message";

function novaMensagem(el){
   let novasMensagens = document.querySelector(".input-mensagem").value;
      upmensagem={
      from: nome,
	   to: nickName,
	   text: novasMensagens,
   	type: tipoMensagem
   }

   promise=axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",upmensagem);
   promise.then(buscarMensagens);
   promise.catch(alertar);
   document.querySelector(".input-mensagem").value="";
}

function alertar(erro){
 alert("Deu erro ai :( ");
 window.location.reload();
}

/*************************************************  BOTOES BONUS **************************************************/

setInterval(BuscarParticipantes,10000);
function verParticipantes(el){
   document.querySelector(".participantes").classList.add("mostrar");
   document.querySelector(".divisao").classList.remove("esconder");
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
      TodosContatos.innerHTML += listaContatos;
   }
}
let privado=document.querySelector(".privado");
let publico=document.querySelector(".publico");
let bot2=document.querySelector(".bot2");

function selecionarChat(el){
   nickName = el.innerHTML;
   console.log(nickName);
}
function selecionarPrivacidade(){
   tipoMensagem="private_message";
   privado.classList.remove("esconder");
   publico.classList.add("esconder");
   bot2.innerHTML= ` <div class="tipo-de-mensagem"><h3>enviando para ${nickName} (reservadamente)</h3></div>`;
}
function selecionarPublicidade(){
   tipoMensagem="message";
   privado.classList.add("esconder");
   publico.classList.remove("esconder");
   bot2.innerHTML= ` <div class="tipo-de-mensagem"><h3>enviando para ${nickName}</h3></div>`;
}

document.addEventListener("keypress", function (el){
   if(el.key === "Enter"){
     const botaoEntrar= document.querySelector(".icone-bot")
     botaoEntrar.click();
}})