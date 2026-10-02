const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Dencius Vault Backend está online 🚀"
  });
});

app.get("/produtos", (req, res) => {
  res.json([
    {
      id: 1,
      nome: "Unlock Tool",
      preco: 0,
      moeda: "USD"
    },
    {
      id: 2,
      nome: "TSM Tool",
      preco: 0,
      moeda: "USD"
    },
    {
      id: 3,
      nome: "AMT Tool",
      preco: 0,
      moeda: "USD"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Dencius Vault Backend rodando na porta ${PORT}`);
});
