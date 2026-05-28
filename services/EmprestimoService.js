const {
  MongoClient,
  WriteConcern,
  ReadConcern,
  ReadPreference,
  ObjectId,
} = require("mongodb");

const uri =
  "mongodb://localhost:27017/?replicaSet=rs0&directConnection=true&retryWrites=false";

const client = new MongoClient(uri);

async function realizarEmprestimo(livro_id, usuario_nome, data_devolucao_prevista) {
  await client.connect();

  await client
    .db("biblioteca_digital", { writeConcern: "majority" })
    .collection("livros")
    .findOne({});

  await client
    .db("biblioteca_digital", { writeConcern: "majority" })
    .collection("emprestimos")
    .findOne({});

  // Define o callback com a sequência de operacoes da transação
  async function callback(session) {
    const livros = session.client
      .db("biblioteca_digital")
      .collection("livros");

    const emprestimos = session.client
      .db("biblioteca_digital")
      .collection("emprestimos");

    // Verifica se o livro existe e tem exemplares disponíveis
    const livro = await livros.findOne(
      { _id: new ObjectId(livro_id) },
      { session }
    );

    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    if (livro.exemplares_disponiveis <= 0) {
      throw new Error("Nenhum exemplar disponível para empréstimo.");
    }
    await emprestimos.insertOne(
      {
        livro_id: new ObjectId(livro_id),
        usuario_nome,
        data_emprestimo: new Date(),
        data_devolucao_prevista: new Date(data_devolucao_prevista),
        status: "ativo",
      },
      { session }
    );

    // Decrementa exemplares_disponiveis do livro
    await livros.updateOne(
      { _id: new ObjectId(livro_id) },
      { $inc: { exemplares_disponiveis: -1 } },
      { session }
    );
  }

  //   Inicia sessão e executa a transação com withTransaction
  await client.withSession((session) =>
    session.withTransaction(callback, {
      readConcern: { level: "local" },
      writeConcern: { w: "majority", timeoutMS: 1000 },
      readPreference: "primary",
    })
  );

  console.log("Empréstimo realizado com sucesso!");
  await client.close();
}

async function devolverLivro(emprestimo_id) {
  await client.connect();

  async function callback(session) {
    const livros = session.client
      .db("biblioteca_digital")
      .collection("livros");

    const emprestimos = session.client
      .db("biblioteca_digital")
      .collection("emprestimos");

    // Verifica se o empréstimo existe e está ativo
    const emprestimo = await emprestimos.findOne(
      { _id: new ObjectId(emprestimo_id) },
      { session }
    );

    if (!emprestimo) {
      throw new Error("Empréstimo não encontrado.");
    }

    if (emprestimo.status === "devolvido") {
      throw new Error("Este livro já foi devolvido.");
    }

    // Atualiza o status do empréstimo
    await emprestimos.updateOne(
      { _id: new ObjectId(emprestimo_id) },
      {
        $set: {
          status: "devolvido",
          data_devolucao_real: new Date(),
        },
      },
      { session }
    );

    // Incrementa exemplares_disponiveis do livro
    await livros.updateOne(
      { _id: emprestimo.livro_id },
      { $inc: { exemplares_disponiveis: 1 } },
      { session }
    );
  }

  await client.withSession((session) =>
    session.withTransaction(callback, {
      readConcern: { level: "local" },
      writeConcern: { w: "majority", timeoutMS: 1000 },
      readPreference: "primary",
    })
  );

  console.log("Devolução realizada com sucesso!");
  await client.close();
}

module.exports = { realizarEmprestimo, devolverLivro };