let nome;
 function entrar(el){
     nome = document.querySelector(".input-usuario").value;
    el.parentNode.classList.add("esconder");    
    alert (nome);
    document.querySelector(".corpo").classList.remove("esconder");
    document.querySelector(".topo").classList.remove("esconder");
    document.querySelector(".bot").classList.remove("esconder");
    buscarMensagens();
 }
 function buscarMensagens(){
    promessa=axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promessa.then(executar);
 }
 function executar(resposta){
    console.log(resposta);
    mensagens=resposta.data;
    entrarNaSala();
}

 function entrarNaSala(){
    let corpo = document.querySelector(".corpo");
    corpo.innerHTML = "";
    for (let i = 0; i < mensagens.length; i++) {
    const carregarMensagens= `<div class="chat-publico"><h6>(09:32:22)</h6><h1>${mensagens[i].name}</h1><h2>para </h2><h1>Todos</h1><h2>${mensagens[i].mesage}</h2></div>`
   // let novadivmensagem= `<div class="chat-publico"><h6>(09:32:22)</h6><h1>Joãoooooooooo</h1><h2>para </h2><h1>Todos</h1><h2>Mensagem</h2></div>`
    corpo.innerHTML += carregarMensagens;}
    //corpo.innerHTML+= novadivmensagem;
 }

 function novaMensagem(el){
    const novasMensagens = document.querySelector(".input-mensagem").value;
    let upmensagem={
        name: nome,
        mesage: novasMensagens
    }
    mensagens.push(upmensagem);
    entrarNaSala();

 }

// get.post("https://mock-api.driven.com.br/api/v6/uol/participants ");