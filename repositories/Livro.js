const { conectar, getDatabase } = require("../db/MongoClient.js");

class Livro {
  constructor() {
    this.colecao = getDatabase("biblioteca").collection("livros");
  }

  async cadastrarLivro(livro) {
    try {
      const livroCadastrado = await this.colecao.insertOne(livro);
      return livroCadastrado;
    } catch (error) {
      console.log("Erro ao cadastrar livro:", error.message);
    }
  }

  async listarLivros() {
    try {
      const livros = await this.colecao.find().toArray();
      return livros;
    } catch (error) {
      console.log("Erro ao listar livros:", error.message);
    }
  }

  async buscarLivroPorTitulo(titulo) {
    try {
      const livro = await this.colecao.findOne({ titulo });
      return livro;
    } catch (error) {
      console.log("Erro ao buscar livro:", error.message);
    }
  }

  async atualizarLivro(id, novosDados) {
    try {
      const livroAtualizado = await this.colecao.updateOne(
        { _id: id },
        { $set: novosDados }
      );

      return livroAtualizado;
    } catch (error) {
      console.log("Erro ao atualizar livro:", error.message);
    }
  }

  async removerLivro(id) {
    try {
      const livroRemovido = await this.colecao.deleteOne({ _id: id });
      console.log(livroRemovido)
      return livroRemovido;
      
    } catch (error) {
      console.log("Erro ao remover livro:", error.message);
    }
  }
}

module.exports = Livro;