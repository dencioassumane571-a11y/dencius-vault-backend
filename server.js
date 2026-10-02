const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 3000;

const produtos = [
    {
        id: 1,
        codigo: "unlock",
        nome: "Unlock Tool",
        descricao: "Licença de software para técnicos.",
        preco: 500,
        moeda: "MZN"
    },
    {
        id: 2,
        codigo: "tsm",
        nome: "TSM Tool",
        descricao: "Licença de software para reparação de smartphones.",
        preco: 700,
        moeda: "MZN"
    },
    {
        id: 3,
        codigo: "amt",
        nome: "AMT Tool",
        descricao: "Licença de software para técnicos.",
        preco: 1000,
        moeda: "MZN"
    }
];

const server = http.createServer((req, res) => {
    const caminho = url.parse(req.url, true).pathname;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Página inicial da API
    if (req.method === "GET" && caminho === "/") {
        res.writeHead(200);
        res.end(JSON.stringify({
            projeto: "Dencius Vault",
            status: "Backend funcionando",
            versao: "1.0"
        }));
        return;
    }

    // Lista de produtos
    if (req.method === "GET" && caminho === "/produtos") {
        res.writeHead(200);
        res.end(JSON.stringify(produtos));
        return;
    }

    // Produto específico
    if (req.method === "GET" && caminho.startsWith("/produtos/")) {
        const identificador = caminho.split("/")[2];

        const produto = produtos.find(
            p => p.id === Number(identificador) || p.codigo === identificador
        );

        if (!produto) {
            res.writeHead(404);
            res.end(JSON.stringify({
                erro: "Produto não encontrado"
            }));
            return;
        }

        res.writeHead(200);
        res.end(JSON.stringify(produto));
        return;
    }

    // Criar pedido
    if (req.method === "POST" && caminho === "/pedidos") {
        let corpo = "";

        req.on("data", parte => {
            corpo += parte;
        });

        req.on("end", () => {
            try {
                const pedido = JSON.parse(corpo);

                if (!pedido.produtoId) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        erro: "produtoId é obrigatório"
                    }));
                    return;
                }

                const produto = produtos.find(
                    p => p.id === Number(pedido.produtoId)
                );

                if (!produto) {
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        erro: "Produto não encontrado"
                    }));
                    return;
                }

                const novoPedido = {
                    id: Date.now(),
                    produtoId: produto.id,
                    codigo: produto.codigo,
                    produto: produto.nome,
                    preco: produto.preco,
                    moeda: produto.moeda,
                    status: "aguardando_pagamento"
                };

                res.writeHead(201);
                res.end(JSON.stringify(novoPedido));

            } catch (erro) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    erro: "JSON inválido"
                }));
            }
        });

        return;
    }

    // Rota inexistente
    res.writeHead(404);
    res.end(JSON.stringify({
        erro: "Rota não encontrada"
    }));
});

server.listen(PORT, () => {
    console.log(
        `Dencius Vault Backend iniciado na porta ${PORT}`
    );
});