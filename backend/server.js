require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { z } = require('zod');

// ==========================================
// Configuração do MongoDB
// ==========================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => {
    console.error('Falha na conexão com MongoDB:', err.message);
    process.exit(1);
  });

// Model para tokens invalidados (para produção)
const InvalidToken = mongoose.model('InvalidToken', new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, expires: '1h', default: Date.now }
}));

// ==========================================
// Armazenamento em memória (para desenvolvimento)
// ==========================================
const tokenBlacklist = new Set();

// ==========================================
// Modelo do Usuário
// ==========================================
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
  },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ==========================================
// Schemas de Validação (Zod)
// ==========================================
const emailSchema = z.string().email('Email inválido').min(5).max(100);
const passwordSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100);

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
}).strict();

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(50)
}).strict();

// ==========================================
// Configuração do App
// ==========================================
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'dev-secret-'+require('crypto').randomBytes(32).toString('hex');

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==========================================
// Middlewares Customizados
// ==========================================
const validateRequest = (schema) => (req, res, next) => {
  try {
    req.validatedData = schema.parse(req.body);
    next();
  } catch (err) {
    const errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    res.status(400).json({ success: false, errors });
  }
};

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verifica se o token está invalidado
    if (process.env.NODE_ENV === 'production') {
      const isInvalid = await InvalidToken.exists({ token });
      if (isInvalid) return res.status(401).json({ success: false, message: 'Token inválido' });
    } else {
      if (tokenBlacklist.has(token)) {
        return res.status(401).json({ success: false, message: 'Token inválido (logout realizado)' });
      }
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        const message = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
        return res.status(403).json({ success: false, message });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.error('Erro na autenticação JWT:', err);
    res.status(500).json({ success: false, message: 'Erro durante a autenticação' });
  }
};

// ==========================================
// Rotas
// ==========================================
app.get('/', (req, res) => {
  res.json({ 
    status: 'operational',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.post('/api/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.validatedData;
    
    if (await User.findOne({ email })) {
      return res.status(409).json({ 
        success: false,
        message: 'Email já cadastrado' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword, name });

    res.status(201).json({ 
      success: true,
      message: 'Usuário registrado com sucesso!',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno no servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.post('/api/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedData;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas' 
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      expiresIn: 3600,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno no servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.post('/api/logout', authenticateJWT, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (process.env.NODE_ENV === 'production') {
      await InvalidToken.create({ token });
    } else {
      tokenBlacklist.add(token);
      // Limpeza automática após expiração (apenas desenvolvimento)
      setTimeout(() => tokenBlacklist.delete(token), 3600 * 1000);
    }

    res.json({ 
      success: true,
      message: 'Logout realizado com sucesso' 
    });
  } catch (err) {
    console.error('Erro no logout:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erro durante o logout',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.get('/api/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar dados do usuário',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ==========================================
// Tratamento de Erros Global
// ==========================================
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno no servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ==========================================
// Inicialização do Servidor
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`
  =================================
  Servidor rodando na porta ${PORT}
  Rotas disponíveis:
  - POST /api/register → Registro
  - POST /api/login    → Login
  - POST /api/logout   → Logout
  - GET  /api/profile  → Dados do usuário (protegido)
  =================================
  `);
});

// Encerramento gracioso
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM. Encerrando servidor...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Servidor e conexão com MongoDB encerrados');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT. Encerrando servidor...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Servidor e conexão com MongoDB encerrados');
      process.exit(0);
    });
  });
});