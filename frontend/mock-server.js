import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  {
    id: "1",
    name: "Café Gourmet Brasil",
    price: 24.9,
    description:
      "Café especial 100% arábica, torrado artesanalmente no Brasil.",
    image: "https://placehold.co/200x200?text=Café+Gourmet",
    provider: "brazilian",
  },
  {
    id: "2",
    name: "Chocolate Belga Premium",
    price: 39.9,
    description: "Chocolate importado da Bélgica, 70% cacau, sabor intenso.",
    image: "https://placehold.co/200x200?text=Chocolate+Belga",
    provider: "european",
  },
  {
    id: "3",
    name: "Azeite de Oliva Extra Virgem",
    price: 49.9,
    description:
      "Azeite de oliva extra virgem, prensado a frio, origem Portugal.",
    image: "https://placehold.co/200x200?text=Azeite+Portugal",
    provider: "european",
  },
  {
    id: "4",
    name: "Queijo Canastra Artesanal",
    price: 59.9,
    description: "Queijo mineiro maturado, sabor marcante e textura cremosa.",
    image: "https://placehold.co/200x200?text=Queijo+Canastra",
    provider: "brazilian",
  },
];

let orders = [
  {
    id: 1,
    customerName: "Kalita Trevisan",
    customerEmail: "kalita@email.com",
    total: 64.8,
    status: "completed",
    createdAt: "2025-06-19T20:00:00.000Z",
    items: [
      {
        id: 1,
        productId: "1",
        productName: "Café Gourmet Brasil",
        provider: "brazilian",
        price: 24.9,
        quantity: 2,
        image: "https://placehold.co/200x200?text=Café+Gourmet",
      },
      {
        id: 2,
        productId: "2",
        productName: "Chocolate Belga Premium",
        provider: "european",
        price: 39.9,
        quantity: 1,
        image: "https://placehold.co/200x200?text=Chocolate+Belga",
      },
    ],
  },
  {
    id: 2,
    customerName: "Maria Silva",
    customerEmail: "maria@email.com",
    total: 109.8,
    status: "pending",
    createdAt: "2025-06-18T18:30:00.000Z",
    items: [
      {
        id: 3,
        productId: "3",
        productName: "Azeite de Oliva Extra Virgem",
        provider: "european",
        price: 49.9,
        quantity: 2,
        image: "https://placehold.co/200x200?text=Azeite+Portugal",
      },
      {
        id: 4,
        productId: "4",
        productName: "Queijo Canastra Artesanal",
        provider: "brazilian",
        price: 59.9,
        quantity: 1,
        image: "https://placehold.co/200x200?text=Queijo+Canastra",
      },
    ],
  },
];

// Rotas de produtos
app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:provider/:id", (req, res) => {
  const { provider, id } = req.params;
  const product = products.find((p) => p.id === id && p.provider === provider);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Produto não encontrado" });
  }
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Produto não encontrado" });
  }
});

// Rotas de pedidos
app.get("/orders", (req, res) => {
  res.json(orders);
});

app.get("/orders/:id", (req, res) => {
  const { id } = req.params;
  const order = orders.find((o) => o.id == id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Pedido não encontrado" });
  }
});

app.post("/orders", (req, res) => {
  const newOrder = {
    ...req.body,
    id: orders.length + 1,
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock server rodando em http://localhost:${PORT}`);
});
