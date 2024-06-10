function Nave(context, teclado, imagem, imgExplosao) // função definida, declarando quatro parametros  
{
    this.context = context; // armazena o contexto  
    this.teclado = teclado; //armazena o controle do teclado 
    this.imagem = imagem; //armazena a imagem 
    this.x = 0; //define um valor para o "x"
    this.y = 0; //define um valor para o "y" 
    this.velocidade = 0; // define um valor inicial para a velocidade 
    this.spritesheet = new Spritesheet(context,imagem,3,2); //referencia a spritesheet e define "seu tamanho"
    this.spritesheet.linha = 0; //define a linha inicial da spritesheet
    this.spritesheet.intervalo = 100; //define o intervalo entre os quadros da animação 
    this.imgExplosao = imgExplosao; // armazena a img de explosão
    this.acabaramVidas = null; // função que vai ser solicitada quando as vidas acabarem 
    this.vidasExtras = 3; // define o número de vidas extras 
}
Nave.prototype = //realiza o carregamento do código de maneira eficiente 
{
    atualizar: function() // a posição da nave é atualizada com base na velocidade e no tempo decorrido.
    {
        var incremento = this.velocidade * this.animacao.decorrido / 1000;
        // realiza o incremento da posição da nave 
        // multiplicando a velocidade pelo tempo decorrido da última atualização
        // divide por 1000 para tranformar em milisegundos 
        
        if(this.teclado.pressionada(SETA_ESQUERDA)// verifica se a seta esquerda está selecionada 
        && this.x>0) //e se a nave não está na borda esquerda do canvas 
         this.x -= incremento; // se ambas afirmações forem verdade, a nave se move para a esquerda 
        
        if(this.teclado.pressionada(SETA_DIREITA) // verifica se a seta direita está selecionada 
        && this.x < this.context.canvas.width - 36) // e se a nave não está na borda direita do canvas 
        this.x += incremento; // se ambas forem verdade, a nave se move para a direita 

        if(this.teclado.pressionada(SETA_CIMA) // verifica se a seta cima está selecionada 
        && this.y>0) // e se a nave não está na borda de cima do canvas
         this.y-= incremento; // se ambas forem verdade, a nave se move para a cima
        
        if(this.teclado.pressionada(SETA_BAIXO) // verifica se a seta baixo está selecionada 
        && this.y < this.context.canvas.height - 48) // e se a nave não está na borda de baixo do canvas
        this.y += incremento; //se ambas forem verdade, a nave se move para a baixo
    },
    desenhar: function() // definindo um método que será responsável por desenhar a nave no canvas 
    {
        if(this.teclado.pressionada(SETA_ESQUERDA))// Se a seta esquerda for pressionada 
        this.spritesheet.linha = 1; //a linha da spritesheet é definida como 1
    else if(this.teclado.pressionada(SETA_DIREITA)) // se a seta direita for pressionada 
        this.spritesheet.linha = 2; //a linha é definida como 2
    else
        this.spritesheet.linha = 0; // caso contrário, a linha é definida como 0. 
        // ou seja, dependendo da direção, diferentes spritesheets serão usadas 
        this.spritesheet.desenhar(this.x,this.y);
        this.spritesheet.proximoQuadro();
    },
    atirar: function(){
        var t = new Tiro(this.context,this);
        this.animacao.novoSprite(t);
        this.colisor.novoSprite(t);
    },
    retangulosColisao: function(){
        //valores ajustados 
        var rets = [
            {x: this.x + 2, y: this.y + 19, largura: 9, altura:13},
            {x: this.x + 13, y: this.y + 3, largura: 10, altura:33},
            {x: this.x + 25, y: this.y + 19, largura: 9, altura:13},
        ];
        return rets;
    },
    posicionar: function(){
        var canvas = this.context.canvas;
        this.x = canvas.width /2 - 18;
        this.y = canvas.height - 48;
    },
    colidiuCom: function(outro){
        //se colidiu  com um ovni...
        if(outro instanceof Ovni){
            this.animacao.excluirSprite(this);
            this.animacao.excluirSprite(outro);
            this.colisor.excluirSprite(this);
            this.colisor.excluirSprite(outro);

            var exp1 = new Explosao(this.context, this.imgExplosao, this.x, this.y);
            var exp2 = new Explosao(this.context, this.imgExplosao, outro.x, outro.y);

            this.animacao.novoSprite(exp1);
            this.animacao.novoSprite(exp2);

            var nave = this;
            exp1.fimDaExplosao = function(){
                nave.vidasExtras--;

                if(nave.vidasExtras<0){
                    if(nave.acabaramVidas) nave.acabaramVidas();
                } else {
                    nave.colisor.novoSprite(nave);
                    nave.animacao.novoSprite(nave);
                    nave.posicionar();
                }
            }
        }
    }

}