import express from 'express';
import pool from '../config/database.js';
import multer from 'multer';
import { autenticarToken } from '../middleware/auth.js';

const router = express.Router();

// Buscar todos os chamados
router.get('/', autenticarToken, async (req, res) => {
  try {
    const [chamados] = await pool.query(
      `SELECT c.*, u.nome as nome_criador, u.departamento as departamento_criador
       FROM chamados c
       JOIN usuarios u ON c.criado_por = u.id
       ORDER BY c.criado_em DESC`
    );
    res.json(chamados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

// Criar novo chamado
router.post('/', autenticarToken, async (req, res) => {
  try {
    const { titulo, descricao, prioridade, departamento, imagens } = req.body;
    const usuarioId = req.usuario.id;

    const [resultado] = await pool.query(
      `INSERT INTO chamados (titulo, descricao, prioridade, departamento, criado_por, status)
       VALUES (?, ?, ?, ?, ?, 'aberto')`,
      [titulo, descricao, prioridade, departamento, usuarioId]
    );

    if (imagens && imagens.length > 0) {
      const chamadoId = resultado.insertId;
      const valoresImagens = imagens.map(imagem => [chamadoId, imagem]);
      
      await pool.query(
        'INSERT INTO imagens_chamado (chamado_id, url_imagem) VALUES ?',
        [valoresImagens]
      );
    }

    res.status(201).json({ mensagem: 'Chamado criado com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

// Atualizar status do chamado
router.patch('/:id/status', autenticarToken, async (req, res) => {
  try {
    const { status } = req.body;
    const chamadoId = req.params.id;

    await pool.query(
      'UPDATE chamados SET status = ?, atualizado_em = NOW() WHERE id = ?',
      [status, chamadoId]
    );

    res.json({ mensagem: 'Status do chamado atualizado com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

// Adicionar resposta ao chamado
router.post('/:id/respostas', autenticarToken, async (req, res) => {
  try {
    const { resposta } = req.body;
    const chamadoId = req.params.id;
    const usuarioId = req.usuario.id;

    await pool.query(
      `INSERT INTO respostas_chamado (chamado_id, usuario_id, resposta)
       VALUES (?, ?, ?)`,
      [chamadoId, usuarioId, resposta]
    );

    res.status(201).json({ mensagem: 'Resposta adicionada com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

export default router;