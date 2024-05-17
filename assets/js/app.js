const url_produtos = "https://desafio.xlow.com.br/search"
const url_produtos_por_id = "https://desafio.xlow.com.br/search/"

const lista_produtos = document.querySelector(".lista_produtos");
const quantidade_produtos = document.querySelector("#quantidade_produtos");




//Fazendo GET para obter a quantidade total de produtos
async function pegarQuantidadeProdutos(){
    try{
        const response = await fetch(url_produtos)
        if(response.status === 404){
            throw new Error("Erro na requisição")
        }
        const data = await response.json();
        quantidade_produtos.innerHTML = `${data.length} produtos`
    }catch(error){
        console.error(error);
    }
    
}

//Fazendo GET para obter os Produtos e transformando em component 
async function pegarProdutosEtransformar(){
    const response = await fetch(url_produtos)
    const data = await response.json()

    const produtosBuscadosPorId = data.map(async (item) => {
        const response = await fetch(url_produtos_por_id + item.productId);
        const produto = await response.json();
        return produto.flat();
    })

    const produtos = await Promise.all(produtosBuscadosPorId);
    produtos.forEach(p => {
        p.map( produto =>{
        console.log(produto)
    
        const li_produto = document.createElement('li');
        const img_produto = document.createElement('img');
        const nome_produto = document.createElement('p');
        const btn = document.createElement('button');
        const preco_com_desconto = document.createElement('h3') 
        const preco_sem_desconto = document.createElement('h4')
        const lista_variavel = document.createElement('ul')

        //Verificação de variaveis do produto
        if(produto.items.length > 1){
            produto.items.forEach((v, index) =>{
                if(index === 0 || index === 7 || index > 7) return
                let img = document.createElement('img')
                img.classList.add('img_produto_variavel')
                img.src = v.images[0].imageUrl
                img.onclick = (e) => trocarImagem(e);
                lista_variavel.appendChild(img)
            })
        }


        //Verificação do Desconto
        if(produto.items[0].sellers[0].commertialOffer.Price < produto.items[0].sellers[0].commertialOffer.PriceWithoutDiscount){
            preco_com_desconto.classList.add("preco_desconto")
            preco_com_desconto.innerText = "R$" + produto.items[0].sellers[0].commertialOffer.Price

            preco_sem_desconto.classList.add("preco_puro")    
            preco_sem_desconto.innerText = "R$" + produto.items[0].sellers[0].commertialOffer.PriceWithoutDiscount
        } else{
            preco_sem_desconto.classList.add("preco_normal")
            preco_sem_desconto.innerText = "R$" + produto.items[0].sellers[0].commertialOffer.Price
        }

        //Adicionando valores as propriedades do produto
        img_produto.src = produto.items[0].images[0].imageUrl
        nome_produto.innerText = produto.productName || "Nome não disponivel";
        btn.innerText = "COMPRAR"


        //Colocando Classes nos elementos
        img_produto.classList.add("img_produto")
        nome_produto.classList.add("produto_nome")
        btn.classList.add("btn_comprar")

        //Adicionando os elementos no LI
        li_produto.appendChild(img_produto)
        li_produto.appendChild(nome_produto)
        li_produto.appendChild(lista_variavel)
        if(!(preco_com_desconto === null)){
            li_produto.appendChild(preco_sem_desconto)
            li_produto.appendChild(preco_com_desconto)
        } else{
            li_produto.appendChild(preco_sem_desconto)
        }
        li_produto.appendChild(btn)
        

        //adicionando todos os elementos no ul
        lista_produtos.appendChild(li_produto);
        })
    });


//Função para a troca da imagem principal pela variável dela
function trocarImagem(e) {
    let imgVariavel = e.target;
      
    let listItem = imgVariavel.closest('li')
    let imgProduto = listItem.querySelector('.img_produto, .img_produto2');
        
    if (imgProduto.src && imgVariavel.src) {
            let tempSrc = imgProduto.src;
            imgProduto.src = imgVariavel.src;
            imgVariavel.src = tempSrc;
        } 
    }

}

//Mudando estilo de acordo com a apresentação
function mudarApresentacao(){
        let element1 = document.querySelector(".lista_produtos");
        let element2 = document.querySelector(".lista_produtos2");

        if (element1) {
            element1.classList.remove('lista_produtos');
            element1.classList.add('lista_produtos2');
        }
        if (element2) {
            element2.classList.remove('lista_produtos2');
            element2.classList.add('lista_produtos');
        }
}

//Funcão main da aplicação
function main(){
    pegarQuantidadeProdutos();
    pegarProdutosEtransformar();
}

main();
