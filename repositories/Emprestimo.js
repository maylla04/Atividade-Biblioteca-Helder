const { getDatabase } = require("../db/MongoClient.js");
const { ObjectId } = require("mongodb");

class Emprestimo {
  constructor() {
    this.colecao = getDatabase("biblioteca_digital").collection("emprestimos");
  }

  async cadastrarEmprestimo(emprestimo) {
    try {
      const emprestimoData = {
        livro_id: new ObjectId(emprestimo.livro_id),
        usuario_nome: emprestimo.usuario_nome,
        data_emprestimo: new Date(emprestimo.data_emprestimo),
        data_devolucao_prevista: new Date(emprestimo.data_devolucao_prevista),
        status: "ativo",
      };

      const emprestimoCadastrado = await this.colecao.insertOne(emprestimoData);
      return emprestimoCadastrado;
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

  async buscarEmprestimoPorUsuario(usuario_nome) {
    try {
      const emprestimos = await this.colecao.find({ usuario_nome }).toArray();
      return emprestimos;
    } catch (error) {
      console.log("Erro ao buscar empréstimo:", error.message);
    }
  }

  async listarAtivos() {
    try {
      const emprestimos = await this.colecao
        .find({ status: "ativo" })
        .toArray();
      return emprestimos;
    } catch (error) {
      console.log("Erro ao listar empréstimos ativos:", error.message);
    }
  }

  async registrarDevolucao(id) {
    try {
      const emprestimoAtualizado = await this.colecao.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "devolvido",
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