function Painel (context, nave){
    this.context = context;
    this.nave = nave;
    this.spritesheet = new Spritesheet (context, nave.imagem, 3, 2);
    this.spritesheet.linha = 0;
    this.spritesheet.coluna = 0;
    this.pontuacao = 0; 
}

Painel.prototype = {
    atualizar: function(){

    },
    desenhar: function(){
        this.context.scale(0.5, 0.5);
        var x = 20;
        var y = 20;
        var ctx = this.context;

        for(var i=1;i<=this.nave.vidasExtras;i++){
            this.spritesheet.desenhar(x,y);
            x += 40;
        }
        //torna a dobrar
        this.context.scale(2,2);

        //potuaçao
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '18px sans-serif';
        ctx.fillText(this.pontuacao, 100, 27);
        ctx.restore();
    }
}