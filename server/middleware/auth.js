import jwt from 'jsonwebtoken';

export const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Autenticação necessária' });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (erro) {
    return res.status(403).json({ mensagem: 'Token inválido' });
  }
};

export const autorizarAdmin = (req, res, next) => {
  if (req.usuario.cargo !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso de administrador necessário' });
  }
  next();
};