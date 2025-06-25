//Local:
//Para testes local, deixar dessa forma:
// const express = require('express');
// const jsonServer = require('json-server')
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()
//
// const PORT = 3000
//
// server.use(middlewares)
// server.use(router)
//
// server.listen(PORT, () => {
//   console.log('Servidor JSON está rodando na Porta: ' + PORT)
// })
//
// module.exports = server;

//Versel:
// Deploy para Versel, deixar ativo dessa forma
const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();

// Configurar CORS
const corsOptions = {
    origin: '*', // Permite acesso de qualquer origem
    optionsSuccessStatus: 200 // Algumas versões antigas de navegadores (IE11, diversos SmartTVs) têm problemas com 204
};

app.use(cors(corsOptions));

// Caminho para o arquivo db.json
const dbFilePath = path.join(__dirname, 'db.json');

// Sistema de cache para evitar múltiplas leituras do arquivo
let cachedDB;

async function loadDB() {
    if (cachedDB) return cachedDB;

    try {
        const data = await fs.readFile(dbFilePath, 'utf8');
        if (data) {
            cachedDB = JSON.parse(data);
        } else {
            cachedDB = {};
        }
    } catch (error) {
        console.error('Erro ao carregar o banco de dados:', error);
        // Se não conseguir ler o arquivo, inicie com um objeto vazio
        cachedDB = {};
    }
    return cachedDB;
}

function saveDB() {
    try {
        fs.writeFileSync(dbFilePath, JSON.stringify(cachedDB, null, 2));
        console.log('Banco de dados salvo com sucesso.');
    } catch (error) {
        console.error('Erro ao salvar o banco de dados:', error);
    }
}

// Carrega o banco de dados quando o servidor inicia
loadDB();

app.use(express.json());

/**** -------------  Categorias: -------------------****/
// Endpoint para listar todas as categorias
app.get('/api/categorias', async (req, res) => {
    const db = await loadDB();
    res.json(db.categorias || []);
});

// Endpoint para buscar uma categoria por ID
app.get('/api/categorias/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const db = await loadDB();
    const categoria = db.categorias.find(c => c.id === id);
    if (categoria) {
        res.json(categoria);
    } else {
        res.status(404).json({ message: 'Categoria não encontrada' });
    }
});

// Endpoint para adicionar uma nova categoria
app.post('/api/categorias', async (req, res) => {
    //Carrega o banco:
    let db = await loadDB();

    // Ler os IDs existentes das categorias
    let listIdsCategorias = db.categorias.map(categoria => parseInt(categoria.id));
    // Encontrar o maior ID
    let maiorId = Math.max(...listIdsCategorias);
    // Calcular o próximo ID
    let proximoId = maiorId + 1;

    //id: Date.now() //Caso quiser definir um ID com a data!
    let novaCategoria = {
        id: proximoId,
        nome: req.body.nome,
        descricao: req.body.descricao
    };

    db.categorias.push(novaCategoria);
    saveDB();
    res.status(201).json(novaCategoria);
});

// Endpoint para atualizar uma categoria
app.put('/api/categorias/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const db = await loadDB();
    const index = db.categorias.findIndex(c => c.id === id);
    if (index !== -1) {
        Object.assign(db.categorias[index], req.body);
        saveDB();
        res.json(db.categorias[index]);
    } else {
        res.status(404).json({ message: 'Categoria não encontrada' });
    }
});

// Endpoint para deletar uma categoria
app.delete('/api/categorias/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const db = await loadDB();
    const index = db.categorias.findIndex(c => c.id === id);
    if (index !== -1) {
        db.categorias.splice(index, 1);
        saveDB();
        res.status(204).send('Categoria deletada com sucesso');
    } else {
        res.status(404).json({ message: 'Categoria não encontrada' });
    }
});

/**** -------------  Fornecedores: -------------------****/
app.get('/api/fornecedores', async (req, res) => {
    const db = await loadDB();
    res.json(db.fornecedores || []);
});

// Endpoint para buscar um Fornecedor por ID
app.get('/api/fornecedores/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const db = await loadDB();
    const fornecedor = db.fornecedores.find(c => c.id === id);
    if (fornecedor) {
        res.json(fornecedor);
    } else {
        res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
});

// Endpoint para adicionar um novo Fornecedor
app.post('/api/fornecedores', async (req, res) => {
    //Carrega o banco:
    let db = await loadDB();

    // Ler os IDs existentes dos fornecedores
    let listIdsFornecedores = db.fornecedores.map(fornecedor => parseInt(fornecedor.id));
    // Encontrar o maior ID
    let maiorId = Math.max(...listIdsFornecedores);
    // Calcular o próximo ID
    let proximoId = maiorId + 1;

    //id: Date.now() //Caso quiser definir um ID com a data!
    let novoFornecedor = {
        id: proximoId,
        tituloContato: req.body.tituloContato,
        razaoSocial: req.body.razaoSocial,
        nomeFantasia: req.body.nomeFantasia,
        endereco: {
            rua: req.body.endereco?.rua || null,
            cidade: req.body.endereco?.cidade || null,
            cep: req.body.endereco?.cep || null,
            bairro: req.body.endereco?.bairro || null,
            pais: req.body.endereco?.pais || null,
            telefone: req.body.endereco?.telefone || null
        }
    };

    db.fornecedores.push(novoFornecedor);
    saveDB();
    res.status(201).json(novoFornecedor);
});

// Endpoint para atualizar um Fornecedor
app.put('/api/fornecedores/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const db = await loadDB();
    const index = db.fornecedores.findIndex(c => c.id === id);
    if (index !== -1) {
        Object.assign(db.fornecedores[index], req.body);
        saveDB();
        res.json(db.fornecedores[index]);
    } else {
        res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
});

// Endpoint para deletar um fornecedor
app.delete('/api/fornecedores/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const db = await loadDB();
    const index = db.fornecedores.findIndex(c => c.id === id);
    if (index !== -1) {
        db.fornecedores.splice(index, 1);
        saveDB();
        res.status(204).send('Fornecedor deletado com sucesso');
    } else {
        res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
});

/**** -------------  Produtos: -------------------****/
app.get('/api/produtos', async (req, res) => {
  const db = await loadDB();

  let produtos = db.produtos || [];

  // Filtro: ativo=true (Pode receber esse filtro na requisição da tela de vendas)
  if (req.query.ativo === 'true') {
    produtos = produtos.filter(p => p.ativo === true);
  }

  // Outros filtros podem ser adicionados aqui futuramente!!!
  res.json(produtos);
});

// Endpoint para buscar um Produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const db = await loadDB();
  const produto = db.produtos.find(c => c.id === id);
  if (produto) {
    res.json(produto);
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

// Endpoint para adicionar um novo Produto
app.post('/api/produtos', async (req, res) => {
  //Carrega o banco:
  let db = await loadDB();

  // Ler os IDs existentes dos produtos
  let listIdsProdutos = db.produtos.map(produto => parseInt(produto.id));
  // Encontrar o maior ID
  let maiorId = Math.max(...listIdsProdutos);
  // Calcular o próximo ID
  let proximoId = maiorId + 1;

  //id: Date.now() //Caso quiser definir um ID com a data!
  let novoProduto = {
    id: proximoId,
    fornecedorId: req.body.fornecedorId,
    categoria: req.body.categoria,
    unidadeMedida: req.body.unidadeMedida,
    precoUnitario: req.body.precoUnitario,
    qtdeEstoque: req.body.qtdeEstoque,
    ativo: req.body.ativo,
    descricao: req.body.descricao
  };

  db.produtos.push(novoProduto);
  saveDB();
  res.status(201).json(novoProduto);
});

// Endpoint para atualizar um Produto
app.put('/api/produtos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const db = await loadDB();
  const index = db.produtos.findIndex(c => c.id === id);
  if (index !== -1) {
    Object.assign(db.produtos[index], req.body);
    saveDB();
    res.json(db.produtos[index]);
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

// Endpoint para deletar um Produto
app.delete('/api/produtos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const db = await loadDB();
  const index = db.produtos.findIndex(c => c.id === id);
  if (index !== -1) {
    db.produtos.splice(index, 1);
    saveDB();
    res.status(204).send('Produto deletado com sucesso');
  } else {
    res.status(404).json({ message: 'Produto não encontrado' });
  }
});

module.exports = app;T
