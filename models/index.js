const Sequelize = require('sequelize');
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
require('dotenv').config(); // Carregar as variáveis de ambiente

// Definir as configurações de conexão com o banco de dados
const connection = {
  database: process.env.DATABASE_NAME, // Nome do banco de dados
  username: process.env.ADMIN_USERNAME, // Usuário para a conexão
  password: process.env.ADMIN_PASSWORD, // Senha para o usuário
  host: process.env.HOST, // Endereço do host
  port: process.env.DB_PORT,  // Porta do banco de dados
  dialect: process.env.DIALECT, // Tipo de banco de dados (mysql)
  dialectmodel: process.env.DIALECTMODEL, // Tipo de modelo de dialeto (mysql2)
};

// Criar a instância do Sequelize com a conexão configurada
const sequelize = new Sequelize(connection);

// Objeto para armazenar os modelos
const db = {};
db.sequelize = sequelize;

// Carregar todos os arquivos de modelo dentro da pasta "models"
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {    
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

// Estabelecer as associações entre os modelos, caso existam
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Atribuir a instância do Sequelize à propriedade sequelize do db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exportar o objeto db para uso em outras partes da aplicação
module.exports = db;


