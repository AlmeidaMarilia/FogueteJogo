function Colisor(){
    this.sprites = [];
    this.aoColidir = null;
    this.spritesExcluir = [];
}
Colisor.prototype = {
    novoSprite: function (sprite){
        this.sprites.push(sprite);
        sprite.colisor = this;
    },
    processar: function (){
        //inicio do objeto vazio
        var jaTestados = new Object();
        for(var i in this.sprites){
            for (j in this.sprites){
                //nao colidir com ele mesmo
                if( i == j)continue;

                //gerar strings unicas para os objetos 
                var id1 = this.stringUnica(this.sprites[i]);
                var id2 = this.stringUnica(this.sprites[j]);

                //criar os arrays se nao existirem
                if(!jaTestados[id1]) jaTestados[id1]=[];
                if(!jaTestados[id2]) jaTestados[id2]=[];

                //teste de repetição
                if(!(jaTestados[id1].indexOf(id2) >= 0 || jaTestados[id2].indexOf(id1) >= 0)){

                    //nao considerar a colisao
                    this.testarColisao(this.sprites[i], this.sprites[j]);

                    //registrando o teste
                    jaTestados[id1].push(id2);
                    jaTestados[id2].push(id1);
                }
            }
        }
        this.processarExclusoes();
    },
    testarColisao: function(sprite1,sprite2){
        //obter os retangulos de colisao de cada sprite
        var rets1 = sprite1.retangulosColisao();
        var rets2 = sprite2.retangulosColisao();

        //testar colisao entre os dois
        colisoes:
        for(var i in rets1){
            for(var j in rets2){
                //ignorando a formula 
                if(this.retangulosColidem(rets1[i], rets2[j])){
                    //eles colidem, vamos notifica-los
                    sprite1.colidiuCom(sprite2);
                    sprite2.colidiuCom(sprite1);

                    //tratador geral 
                    if(this.aoColidir)
                    this.aoColidir(sprite1, sprite2);

                    //nao precisa terminar de ver todos os retangulos
                    break colisoes;
                }
            }
        }
    },
    retangulosColidem: function(ret1, ret2){
        //formula de interseção de retangulos
        return(ret1.x + ret1.largura) > ret2.x &&
        ret1.x < (ret2.x + ret2.largura) &&
        (ret1.y + ret1.altura) > ret2.y &&
        ret1.y < (ret2.y + ret2.altura);
    },
    stringUnica: function(sprite){
        var str = '';
        var retangulos = sprite.retangulosColisao();

        for(var i in retangulos){
            str += 'x:' + retangulos[i].x + ',' + 
                   'y:' + retangulos[i].y + ',' +
                   'l:' + retangulos[i].largura + ',' +
                   'a:' + retangulos[i].altura + '\n';
        }
        return str;
    },
    excluirSprite : function(sprite){
        this.spritesExcluir.push(sprite);
    },
    processarExclusoes: function(){
        //criar um novo array 
        var novoArray = [];

        //adicione somente os elementos nao excluidos
        for(var i in this.sprites){
            if(this.spritesExcluir.indexOf(this.sprites[i]) == -1)
            novoArray.push(this.sprites[i]);
        }
        //limpar array de exclusao 
        this.spritesExcluir = [];

        //substituir array velho pelo novo 
        this.sprites = novoArray;
    }
}