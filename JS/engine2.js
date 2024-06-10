//primeiro temos que carregar as imagens 
var imgEspaco = new Image();
imgEspaco.src = 'IMG/fundo-espaco.png';

var imgEstrelas = new Image();
imgEstrelas.src = 'IMG/fundo-estrelas.png';

var imgNuvens = new Image();
imgNuvens.src = 'IMG/fundo-nuvens.png';

var carregadas = 0;
var total = 3;

imgEspaco.onload = carregando;
imgEstrelas.onload = carregando;
imgNuvens.onload = carregando;

function carregando(){
    carregadas++;
    if(carregadas == total) iniciar ();
}

function iniciar(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    //passo o context e as imagens do fundo 
    var fundoEspaco = new Fundo(context, imgEspaco);
    var fundoEstrelas = new Fundo (context, imgEstrelas);
    var fundoNuvens = new Fundo (context, imgNuvens);

    //cada um a uma velocidade diferente
    fundoEspaco.velocidade = 50;
    fundoEstrelas.velocidade = 10;
    fundoNuvens.velocidade = 2;

    var animacao = new Animacao(context);
    animacao.novoSprite(fundoEspaco);
    animacao.novoSprite(fundoEstrelas);
    animacao.novoSprite(fundoNuvens);
    animacao.ligar();
}