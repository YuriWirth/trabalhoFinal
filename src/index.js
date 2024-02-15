import express from "express";
import bcrypt from "bcrypt";

const app = express();
const port = 3030;

app.use(express.json());

app.listen(port, () => console.log(`server iniciado${port}`));

let alunos = [];
let contador = 1;

app.post("/criar", async (req, res) => {
  const senha = req.body.senha;
  const email= req.body.email
  const senhaCripto = await bcrypt.hash(senha, 10);

  const estudante = {
    id: contador,
    nome: req.body.nome,
    email: req.body.email,
    senha: senhaCripto,
  };
 
  const verificarConta = alunos.find((estudante) => estudante.email === email);
  if (verificarConta) {
    res.status(404).send("Conta já existente!");
  } else {
    res.status(201).send("Sua conta foi criada com sucesso!");
    alunos.push(estudante);
    contador++;
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const aluno = alunos.find((estudante) => estudante.email === email);
  const senhaCripto = await bcrypt.hash(senha, 10);

  if (aluno) {
    bcrypt.compare(senha, senhaCripto, (error, result) => {
      if (result) {
        res
          .status(200)
          .json({ sucess: true, msg: "Login realizado com sucesso!" });
      } else {
        res.status(404).json({ sucess: false, msg: "Senha incorreta!" });
      }
    });
  } else {
    res.status(404).send("Senha ou email incorreto!");
  }
});

app.get("/usuariosregistrados", (req, res) => {
    res.status(200).json(alunos)
})

let recados = []
let contadorRecados= 1
app.post("/recados/:email", (req, res) => {

   const mensagem ={
     id: contadorRecados,
     titulo: req.body.titulo,
     descricao: req.body.descricao,
   }
   recados.push(mensagem)
   res.status(201).json("Recado enviado!")
   contadorRecados++
})

app.get("/verRecados/:email", (req, res) => {
  res.status(200).json(recados)
})

app.put("/atualizarRecados/:email/:id", (req, res) => {
      
  const id = parseInt(req.params.id)

  const filtradosRecados = recados.filter((recado) => recado.id === id)
  
  
  
  if (filtradosRecados.length === 0) {
    res.status(404).send("Recado não encontrado!")
    return;
  } 
    filtradosRecados.forEach((recado) =>{
    recado.titulo = req.body.titulo
    recado.descricao = req.body.descricao  
  })
   
  res.status(200).send("Recado atualizado com sucesso!")
});
   
  app.delete("/deletar/:email/:id",(req, res) =>{
    const id = parseInt(req.params.id)

    const filtrados = recados.filter((recado) => recado.id === id)

    if(filtrados.length === 0){
      res.status(404).send("Recado não encontrado!")
      return;

    }
    recados = recados.filter((recado) => recado.id !== id)
    res.status(200).send("Recado deletado com sucesso!")
  })
  