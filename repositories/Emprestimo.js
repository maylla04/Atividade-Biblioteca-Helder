const { getDatabase } = require("../db/MongoClient.js");
const { ObjectId } = require("mongodb");

class Emprestimo {
  constructor() {
    this.colecao = getDatabase("biblioteca_digital").collection("emprestimos");
  }

  async cadastrarEmprestimo(emprestimo) {
    try {
      const emprestimoData = {
        ...emprestimo,
        livro_id: new ObjectId(emprestimo.livro_id),
        data_emprestimo: new Date(emprestimo.data_emprestimo),
        data_devolucao: new Date(emprestimo.data_devolucao),
        devolvido: false,
      };

      const emprestimoСadastrado = await this.colecao.insertOne(emprestimoData);
      return emprestimoСadastrado;
    } catch (error) {
      console.log("Erro ao cadastrar empréstimo:", error.message);
    }
  }

  async listarEmprestimos() {
    try {
      const emprestimos = await this.colecao.find().toArray();
      return emprestimos;
    } catch (error) {
      console.log("Erro ao listar empréstimos:", error.message);
    }
  }

  async buscarEmprestimoPorAluno(nome_aluno) {
    try {
      const emprestimos = await this.colecao.find({ nome_aluno }).toArray();
      return emprestimos;
    } catch (error) {
      console.log("Erro ao buscar empréstimo:", error.message);
    }
  }

  async listarNaoDevolvidos() {
    try {
      const emprestimos = await this.colecao
        .find({ devolvido: false })
        .toArray();
      return emprestimos;
    } catch (error) {
      console.log("Erro ao listar empréstimos não devolvidos:", error.message);
    }
  }

  async registrarDevolucao(id) {
    try {
      const emprestimoAtualizado = await this.colecao.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            devolvido: true,
            data_devolucao_real: new Date(),
          },
        }
      );
      return emprestimoAtualizado;
    } catch (error) {
      console.log("Erro ao registrar devolução:", error.message);
    }
  }

  async atualizarEmprestimo(id, novosDados) {
    try {
      const emprestimoAtualizado = await this.colecao.updateOne(
        { _id: new ObjectId(id) },
        { $set: novosDados }
      );
      return emprestimoAtualizado;
    } catch (error) {
      console.log("Erro ao atualizar empréstimo:", error.message);
    }
  }

  async removerEmprestimo(id) {
    try {
      const emprestimoRemovido = await this.colecao.deleteOne({
        _id: new ObjectId(id),
      });
      console.log(emprestimoRemovido);
      return emprestimoRemovido;
    } catch (error) {
      console.log("Erro ao remover empréstimo:", error.message);
    }
  }
}

module.exports = Emprestimo;