import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { autenticarToken, autorizarAdmin } from '../middleware/auth.js';

const router = express.Router();

// Criar novo usuário (apenas admin)
router.post('/', autenticarToken, autorizarAdmin, async (req, res) => {
  try {
    const { nome, email, senha, cargo, departamento, telefone } = req.body;
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    await pool.query(
      `INSERT INTO usuarios (nome, email, senha, cargo, departamento, telefone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, senhaHash, cargo, departamento, telefone]
    );

    res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

export default router;