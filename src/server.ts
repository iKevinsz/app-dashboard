import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

app.use(cors()); // Importante para o App conseguir acessar a API
app.use(express.json());

// Rota para buscar faturamento (exemplo para seu Dashboard)
app.get('/faturamento', async (req, res) => {
  try {
    const vendas = await prisma.venda.findMany();
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

// Rota de Login (exemplo para sua tela de Login)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Aqui você faria a lógica de buscar o usuário no MySQL via Prisma
  // const user = await prisma.user.findUnique({ where: { email } });
  res.json({ success: true, token: "seu-jwt-token" });
});

app.listen(3000, () => console.log("🚀 API rodando em http://localhost:3000"));