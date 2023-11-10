const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public')); // Diretório de arquivos estáticos

const connection = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: 'Arduino123.',
  database: 'controledeentrada'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao MySQL');
});

app.get('/cadastro', (req, res) => {
  res.sendFile(__dirname + '/public/cadastro.html'); // Página de formulário de cadastro
});

app.post('/cadastro', (req, res) => {
  const { nome, cpf, telefone } = req.body;

  if (!nome || !cpf || !telefone) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  // Inserir na tabela "moradores"
  const query = 'INSERT INTO moradores (nome, cpf, telefone) VALUES (?, ?, ?)';

  connection.execute(query, [nome, cpf, telefone], (err, result) => {
    if (err) {
      console.error('Erro ao inserir morador:', err);
      return res.status(500).json({ message: 'Erro ao inserir morador' });
    }

    res.status(201).json({ message: 'Morador inserido com sucesso' });
  });
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
