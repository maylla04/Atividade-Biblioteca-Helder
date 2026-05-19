const { conectar } = require("./db/MongoClient");
const Livro = require("./repositories/Livro");
const { ObjectId } = require("mongodb")

async function main() {
  try {
    await conectar();

    const livroRepository = new Livro();

    await livroRepository.cadastrarLivro({
      titulo: "Brechas da Poesia", autor: "Gabriel Benaki", ano: 2025, disponivel: true,
    });

    const livros = await livroRepository.listarLivros();
    console.log("Livros cadastrados:", livros);

    const livroEncontrado = await livroRepository.buscarLivroPorTitulo(
      "Brechas da Poesia"
    );

    console.log("Livro encontrado:", livroEncontrado);

    await livroRepository.atualizarLivro(
      livroEncontrado._id,
      {
        disponivel: false,
      }
    );

    console.log("Livro atualizado com sucesso!");

    await livroRepository.removerLivro(livroEncontrado._id);

    console.log("Livro removido com sucesso!");

} catch (erro) {
    console.log("Erro ao iniciar a aplicação:", erro.message);
  }
}

main();