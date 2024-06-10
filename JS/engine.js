//Canvas e Context
var canvas = document.getElementById('canvas'); 
// criação de uma variável q vai armazenar a a referência ao elemento canvas, chamando o id canvas, escrito no html
var context = canvas.getContext('2d');
//declarando uma variável context, que vai armazenar o desenho 2d

//Variáveis principais
var imagens, animacao, teclado, colisor, 
nave, criadorInimigos; //declara variáveis sem definir seus valores 
var totalImagens = 0, carregadas = 0; // declarando duas novas variáveis e iniciando-as com valor 0
var musicaAcao; // outra nova variável sem valor 

//Começa carregando as imagens
carregarImagens(); // chama a função para subir imagens 
carregarMusicas(); // chama a função para sumir musicas
//Carregar imagens
function carregarImagens() // função responsável por carregar as imagens 
{
    //Objeto contendo os nomes das imagens
    imagens = // declara um objeto, que vai armazenar o caminho das imagens
    {
    //define a imagem e o "link" 
    espaco: 'fundo-espaco.png',
    estrelas: 'fundo-estrelas.png',
    nuvens: 'fundo-nuvens.png',
    nave: 'nave-spritesheet.png',
    ovni: 'ovni.png',
    explosao: 'explosao.png'
};

//Carregar todas
for(var i in imagens) //"conta todas as propriedades do objeto"
{
    var img = new Image(); // cria uma instancia para carregar as imagens 
    img.src = 'IMG/' + imagens[i]; // recebe o caminho da imagem, na pasta IMG, e depois seu nome 
    img.onload = carregando; //  quando a imagem terminar de ser carregada, a função carregando será chamada.
    totalImagens++; //Incrementa a variável, para acompanhar quantas imagens estão sendo carregadas. 

    
    imagens[i] = img; //Substituir nome pela imagem
}
}

function carregando() // função que será chamada quando as imagens terminarem de carregar.
{
   context.save(); // Salva o estado atual do contexto de renderização

   //Fundo
    context.drawImage// desenha uma imagem 
    (imagens.espaco, //imagem carregada anteriormente
    0, 0, canvas.width, canvas.height); //define como a imagem deve ser desenhada 
   //Texto carregando
   context.fillStyle = 'white'; //define a cor do texto
   context.strokeStyle = 'black'; // define o contorno do texto
   context.font = '50px sans-serif'; // define a fonte do texto
   context.fillText("Carregando...", 100,200); // desenha o texto preenchido
   context.strokeText("Carregando..",100,200); //desenha o contorno do texto 
                       //rendenização 

   //Barra de loading
   carregadas++; 
   // essa variável incrementa +1, para saber quantas imagens já foram carregadas 
   var tamanhoTotal = 300; // É definida uma variável tamanhoTotal com o valor 300. 
   var tamanho = carregadas / totalImagens * tamanhoTotal;
   //está sendo calculado o tamanho de um retângulo a ser desenhado no canvas. 
   context.fillStyle = 'yellow'; // Define a cor de preenchimento para o retângulo.
   context.fillRect(100,250, tamanho, 50); 
   //Esta linha desenha um retângulo com a cor e as dimensões definidas anteriormente.
   context.restore(); //  Isso restaura o estado do contexto de desenho para o último ponto salvo. 


if(carregadas == totalImagens) {//está sendo verificado se o número de imagen
iniciarObjetos();//carregadas é igual ao número total de imagens. 
mostrarLinkJogar();//Se forem iguais, duas funções são chamadas.
}//essas funções iniciam os objetos e mostram um link para iniciar o jogo.
} 

function iniciarObjetos(){
//define a função e inicia os objetos 

//Objetos principais
animacao = new Animacao(context); 
//um novo objeto é criado representando a animação principal do jogo. O contexto é passado como parâmetro para este objeto.
teclado = new Teclado(document); 
//Um novo objeto é criado, responsável por lidar com a entrada do teclado. 
colisor = new Colisor();
//Um novo objeto é criado, responsável por detectar colisões entre os elementos do jogo.
espaco = new Fundo(context, imagens.espaco);
estrelas = new Fundo(context, imagens.estrelas);
nuvens = new Fundo(context, imagens.nuvens);
//Três novos objetos Fundo estão sendo criados, representando diferentes camadas de fundo
 // para o jogo. Cada um recebe o contexto de desenho e uma imagem específica como parâmetro.
nave = new Nave(context, teclado, imagens.nave, imagens.explosao);
//Um novo objeto é criado, representando a nave. Ele recebe o contexto de desenho, Teclado, e duas imagens (uma para a nave em si e outra para a explosão).
painel = new Painel(context, nave); 
//Um novo objeto é criado, representa o painel de informações do jogo.

//Ligaçoes entre objetos
animacao.novoSprite(espaco); //novoSprite() é um método da classe 
animacao.novoSprite(estrelas); //Animacao adiciona um novo sprite à animação.
animacao.novoSprite(nuvens);
animacao.novoSprite(painel);
animacao.novoSprite(nave);
 // as linhas acima adicionam os objetos criados à animação principal.
colisor.novoSprite(nave); 
// a nave é adicionada ao colisor, deve ser verificada por colisões com outros sprites.
animacao.novoProcessamento(colisor);
// objeto colisor é adicionado ao processamento da animação, a detecção de colisões ocorrerá durante a animação.

configuracoesIniciais();
} //chama a função 

function configuracoesIniciais(){  //chama a função, responsável por configurar alguns parâmetros iniciais para o jogo.
//Fundos
espaco.velocidade = 60;
estrelas.velocidade = 150;
nuvens.velocidade = 50;
//configuram a velocidade de movimento dos fundos do jogo.

//Nave
nave.posicionar(); 
//Esta linha chama um método no objeto nave, responsável por posicionar a nave do jogador na inicial na tela.
nave.velocidade = 150; //velocidade da nave está sendo configurada 

criacaoInimigos(); // chama uma função 

nave.acabaramVidas = function(){ // uma função está sendo atribuída à propriedade
   animacao.desligar(); //desligar a animação do jogo  
   gameOver(); // mostra uma tela de fim de jogo.
} //Essa função é chamada quando as vidas da nave acabam.

colisor.aoColidir = function(o1, o2){ // uma função está sendo atribuída à propriedade
   //Tiro com ovni
   if( (o1 instanceof Tiro && o2 instanceof Ovni) || // Esta condição verifica se a colisão ocorreu entre os objetos, 
       (o1 instanceof Ovni && o2 instanceof Tiro)) //Se essa condição for verdadeira, significa que um tiro atingiu um ovni.
       painel.pontuacao +=10; // Se a condição acima for verdadeira, isso significa que um tiro atingiu um ovni, então a pontuação no painel do jogo é aumentada em 10 pontos.
} // Esta função é chamada sempre que ocorre uma colisão entre dois objetos do jogo.
}

function criacaoInimigos(){ //função responsável por criar inimigos 
   criadorInimigos = { //objeto está sendo criado
    ultimoOvni: new Date().getTime(), //rmazena o momento que o ultimo ovini foi criado 

    processar: function(){ //responsável por processar a criação de ovnis
        var agora = new Date().getTime(); // obtem o momento atual 
        var decorrido = agora - this.ultimoOvni;
        // Calcula-se o tempo decorrido desde a criação do último ovni.
        if(decorrido > 1000){ //Se já passou mais de 1 segundo desde a criação do último ovni, 
            novoOvni(); //cria um novo, nan função 
            this.ultimoOvni = agora; //atualiza o tempo 
        }
    }
};
animacao.novoProcessamento(criadorInimigos);
} // o objeto é adicionado ao ciclo de processamento da animação, para que ele seja chamado periodicamente para criar novos ovnis.

function novoOvni(){ //chama a função 
var imgOvni = imagens.ovni; // a variável é inicializada com a imagem do ovni 
var ovni = new Ovni(context, imgOvni, imagens.explosao);
// um novo objeto é criado, recebendo três parâmetros 

//Mínimo: 500; máximo:1000
ovni.velocidade = Math.floor(500 + Math.random() * (1000 - 500 + 1)); //Aqui, a velocidade do ovni é definida.
// A função Math.random() gera um número aleatório entre 0 (inclusive) e 1 (exclusivo), então esse número 
// é multiplicado pelo intervalo desejado (1000 - 500), e então adicionado ao valor mínimo de velocidade (500).
// O Math.floor() é usado para arredondar o resultado para o número inteiro mais próximo.


//Mínimo: 0
//Máximo: largura do canvas - largura do ovni
ovni.x = Math.floor(Math.random()* (canvas.width - imgOvni.width + 1));
// a posição "x" é definida aleatoriamente 

//Descontar a altura
ovni.y = -imgOvni.height;
// a posição "y" é definida para fora do canvas, garantindo que o ovni apareça inicialmente acima do topo da tela.

animacao.novoSprite(ovni); //O novo ovni é adicionado à animação como um novo sprite. 
colisor.novoSprite(ovni);
//: O novo ovni também é adicionado ao colisor, para detecção de colisões com outros objetos do jogo.
}

function pausarJogo(){ //função responsável por pausar ou retomar a animação do jogo
   if(animacao.ligado){ // verifica se a animação está atualmente ligada.
       animacao.desligar(); //for verdadeiro, o jogo está em execução e precisa ser pausado.
       ativarTiro(false); //função é chamada para desativar os tiros enquanto o jogo está pausado.

       //Escrever pausado
       context.save(); //estado atual do contexto de desenho é salvo.
       context.fillStyle = 'white'; // a cor do preenchimento 
       context.strokeStyle = 'black'; // e a cor da borda são definidas 
       context.font = '50px sans-serif'; // a fonte e o tamanho são definidos 
       context.fillText("Pausado", 160, 200); // o texto é desenhado no canvas 
       context.strokeText("Pausado", 160,200); // desenha o contorno do texto,  A posição do texto é definida
       context.restore(); //o estado anterior do contexto de desenho é restaurado.
   }else{ // Se a animação não estiver ligada, isso significa que o jogo está pausado e precisa ser retomado.
       criadorInimigos.ultimoOvni = new Date().getTime(); // o timestamp do último ovni criado é atualizado para o momento atual. 
       animacao.ligar(); //A animação é ligada novamente, retomando a atualização dos sprites e elementos do jogo.
       ativarTiro(true); //Esta função é chamada para ativar os tiros do jogador novamente, uma vez que o jogo foi retomado.
   }
}
function ativarTiro(atirar){ //recebe um parâmetro, que indica se o jogador pode atirar ou não.
   if(atirar){ // se atirar for verdade 
       teclado.disparou(ESPACO, function(){ //configura a tecla de espaço para quando for disparada
           nave.atirar(); // quando o jogador pressionar a tecla de espaço, a nave irá atirar
       });
   }
   else //Se atirar for falso, ou seja, se o jogador não pode atirar
       teclado.disparou(ESPACO, null); // se o jogador pressionar a tecla de espaço, nada acontecerá.
}


function carregarMusicas(){ //função responsável por carregar a música do fundo 
   musicaAcao = new Audio(); //Cria um novo elemento de áudio.
   musicaAcao.src = 'snd/musica-acao.mp3'; //Define o caminho do arquivo de áudio 
   musicaAcao.load(); // Inicia o carregamento do arquivo de áudio.
   musicaAcao.volume = 0.8; //Define o volume da música
   musicaAcao.loop = true; // Define que a música deve ser repetida continuamente após terminar.
};

function mostrarLinkJogar(){ //criação da função 
   document.getElementById('link_jogar').style.display = 'block';
} //Esta linha encontra o elemento HTML com o ID, fazendo com que o elemento seja exibido na tela. 

function iniciarJogo(){ //função responsável por iniciar o jogo 
   criacaoInimigos.ultimoOvni = new Date().getTime();
   //Define o timestamp do último ovni criado como o momento atual. 

   //Tiro
   ativarTiro(true);
   // Ativa a capacidade de atirar, permitindo que pressione a tecla de espaço para atirar.

  
   //Pausa
   teclado.disparou(ENTER, pausarJogo); //Isso permite que o jogador pause o jogo pressionando a tecla Enter.
   document.getElementById('link_jogar').style.display = 'none';
   //Esconde o link ou botão de jogar definido anteriormente.
   
   painel.pontuacao = 0; //Define a pontuação inicial do jogador como zero.
   musicaAcao.play(); //Inicia a reprodução da música de ação do jogo.
   animacao.ligar(); // Liga a animação do jogo, iniciando o ciclo de atualização dos elementos do jogo e a renderização na tela.
}   

function gameOver(){ //responsável por executar uma série de ações quando o jogo termina. 
   //Tiro
   ativarTiro(false); //Desativa a capacidade de atirar, impedindo que pressione a tecla de espaço para atirar.

   //Pausa
   teclado.disparou(ENTER, null); // Remove qualquer ação associada ao evento de pressionar a tecla Enter.

   //Parar a música e rebobinar
   musicaAcao.pause(); //Pausa a reprodução da música de ação do jogo.
   musicaAcao.currentTime = 0.0;
   //Define o tempo atual da música de ação como 0.0 segundos. Isso efetivamente rebobina a música para o início, 
   //para que ela esteja pronta para ser reproduzida novamente quando o jogo for reiniciado.
   
   //Fundo 
   context.drawImage(imagens.espaco, 0,0, canvas.width, canvas.height);
   //Desenha a imagem do espaço no canvas, preenchendo todo o espaço do canvas.

   //Texto 'Game Over'
   context.save(); //Salva o estado atual do contexto de desenho.
   context.fillStyle = 'white'; //Define a cor de preenchimento
   context.strokeStyle = 'black'; //a cor da borda
   context.font = '70px sans-serif'; //estilo de fonte
   context.fillText("GAME OVER", 40, 200); // Desenha o texto "GAME OVER" no canvas. 
   context.strokeText("GAME OVER", 40, 200); //desenha o contorno do texto.
   context.restore();//Restaura o estado anterior do contexto de desenho, revertendo as mudanças de cor, estilo de fonte e texto feitas anteriormente.


   //Voltar o link "JOGAR"
   mostrarLinkJogar(); // Chama a função para exibir novamente o botão para começar a jogar.

   //Restaurar as condições da nave
   nave.vidasExtras = 3; //Define o número de vidas extras da nave como 3.
   nave.posicionar(); //Posiciona a nave em uma posição inicial no jogo.
   animacao.novoSprite(nave); //Adiciona a nave novamente à animação
   colisor.novoSprite(nave); //e ao colisor para que ela seja considerada novamente no ciclo de jogo.

   //Tirar todos os inimigos 
   removerInimigos(); // função parece ser responsável por remover todos os inimigos da animação quando o jogo termina.
}

 function removerInimigos(){ 
   for(var i in animacao.sprites){//Itera sobre todos os sprites na animação.
       if(animacao.sprites[i] instanceof Ovni) //Verifica se o sprite atual é uma instância da classe 
       animacao.excluirSprite(animacao.sprites[i]); 
       //Se o sprite for um ovni, ele é removido da animação utilizando o método,
       //significa que o ovni não será mais considerado no ciclo de atualização da animação.
   }
 }