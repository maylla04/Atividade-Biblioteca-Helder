const { getDatabase } = require("../db/MongoClient.js");
const { ObjectId } = require("mongodb");

class Livro {
  constructor() {
    this.colecao = getDatabase("biblioteca_digital").collection("livros");
  }

  async cadastrarLivro(livro) {
    try {
      const livroData = {
        titulo: livro.titulo,
        autor: livro.autor,
        isbn: livro.isbn,
        exemplares_total: livro.exemplares_total,
        exemplares_disponiveis: livro.exemplares_total, // começa igual ao total
      };

      const livroCadastrado = await this.colecao.insertOne(livroData);
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

  async buscarLivroPorIsbn(isbn) {
    try {
      const livro = await this.colecao.findOne({ isbn });
      return livro;
    } catch (error) {
      console.log("Erro ao buscar livro por ISBN:", error.message);
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
      
      console.log(livroRemovido);
      return livroRemovido;
      
    } catch (error) {
      console.log("Erro ao remover livro:", error.message);
    }
  }
}

module.exports = Livro;