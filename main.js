const { conectar } = require("./db/MongoClient");
const Livro = require("./repositories/Livro");

async function main() {
  try {
    await conectar();
    const livroRepository = new Livro();
    await livroRepository.cadastrarLivro({
      titulo: "Brechas da Poesia", autor: "Gabriel Benaki", ano: 2025, disponivel: true,
    });

    console.log("Livro foi registrado com sucesso!");
  } catch (erro) {
    console.log("Erro ao iniciar a aplicação:", erro.message);
  }
}

main();