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
    console.log(produtos)
    produtos.forEach(p => {
        p.map( produto =>{
        console.log(produto)
        const li_produto = document.createElement('li');
        const img_produto = document.createElement('img');
        const nome_produto = document.createElement('p');
        const btn = document.createElement('button');
        
        img_produto.src = produto.items[0].images[0].imageUrl
        nome_produto.innerText = produto.productName || "Nome não disponivel";
        btn.innerText = "COMPRAR"

        img_produto.classList.add("img_produto")
        nome_produto.classList.add("produto_nome")
        btn.classList.add("btn_comprar")

        li_produto.appendChild(img_produto)
        li_produto.appendChild(nome_produto)
        li_produto.appendChild(btn)

        lista_produtos.appendChild(li_produto);
        })
    });
    
}


pegarQuantidadeProdutos();
pegarProdutosEtransformar();