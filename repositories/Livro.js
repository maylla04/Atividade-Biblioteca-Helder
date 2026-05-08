const { conectar, getDatabase } = require("../db/MongoClient.js");

class Livro {
  constructor() {
    this.colecao = getDatabase("biblioteca").collection("livros");
  }

  async cadastrarLivro(livro) {
    try {
      const resultado = this.colecao.insertOne(livro);
      return resultado;
    } catch (error) {
      console.log();
    }
  }
  ...
}
