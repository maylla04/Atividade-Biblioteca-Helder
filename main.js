const { conectar } = require("./db/MongoClient");
const Livro = require("./repositories/Livro");
const Emprestimo = require("./repositories/Emprestimo");
const { ObjectId } = require("mongodb");

async function main() {
  try {
    await conectar();

    const livroRepository = new Livro();
    const emprestimoRepository = new Emprestimo();

    // ── LIVROS ──────────────────────────────────────────────
    await livroRepository.cadastrarLivro({
      titulo: "Brechas da Poesia",
      autor: "Gabriel Benaki",
      ano: 2025,
      disponivel: true,
    });

    const livros = await livroRepository.listarLivros();
    console.log("Livros cadastrados:", livros);

    const livroEncontrado = await livroRepository.buscarLivroPorTitulo(
      "Brechas da Poesia"
    );
    console.log("Livro encontrado:", livroEncontrado);

    await livroRepository.atualizarLivro(livroEncontrado._id, {
      disponivel: false,
    });
    console.log("Livro atualizado com sucesso!");

    // ── EMPRÉSTIMOS ──────────────────────────────────────────
    const emprestimoCriado = await emprestimoRepository.cadastrarEmprestimo({
      livro_id: livroEncontrado._id,
      nome_aluno: "Maylla Nascimento",
      data_emprestimo: "2026-04-27",
      data_devolucao: "2026-04-29",
    });
    console.log("Empréstimo cadastrado:", emprestimoCriado);

    const emprestimos = await emprestimoRepository.listarEmprestimos();
    console.log("Empréstimos cadastrados:", emprestimos);

    const emprestimosPorAluno =
      await emprestimoRepository.buscarEmprestimoPorAluno("Maylla Nascimento");
    console.log("Empréstimos da Maylla:", emprestimosPorAluno);

    const naoDevolvidos = await emprestimoRepository.listarNaoDevolvidos();
    console.log("Empréstimos não devolvidos:", naoDevolvidos);

    await emprestimoRepository.registrarDevolucao(
      emprestimoCriado.insertedId
    );
    console.log("Devolução registrada com sucesso!");

    await emprestimoRepository.removerEmprestimo(
      emprestimoCriado.insertedId
    );
    console.log("Empréstimo removido com sucesso!");

    // ── LIMPEZA ──────────────────────────────────────────────
    await livroRepository.removerLivro(livroEncontrado._id);
    console.log("Livro removido com sucesso!");

  } catch (erro) {
    console.log("Erro ao iniciar a aplicação:", erro.message);
  }
}

main();