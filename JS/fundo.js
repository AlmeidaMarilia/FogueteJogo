function Fundo (context, imagem) {
    this.context = context;
    this.imagem = imagem;
    this.velocidade = 0;
    this.posicaoEmenda = 0;
}
Fundo.prototype = {//ajuda a renderizar e rodar melhor o programa 
    atualizar: function(){
        //atualiza a posicao de emenda
        this.posicaoEmenda += this.velocidade;

        //emenda passou da posicao
        if(this.posicaoEmenda > this.imagem.height)
           this.posicaoEmenda = 0;

    },
    desenhar: function(){
        var img = this.imagem;
        //primeira copia da imagem
        var posicaoY = this.posicaoEmenda - img.height;
        this.context.drawImage(img,0,posicaoY,img.width,img.height);

        //segunda cópia da imagem 
        posicaoY = this.posicaoEmenda;
        this.context.drawImage(img,0,posicaoY,img.width,img.height);

    }
}