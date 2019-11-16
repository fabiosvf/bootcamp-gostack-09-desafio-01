const express = require('express');
const server = express();

const projects = [];
let counter = 0;

server.use(express.json());

server.use((req, res, next) => {
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  counter++;
  console.log(`Quantidade de requisições até o momento: ${counter}`);
});

//Checa se o Projeto Existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const filtro = p => p.id == id;
  const project = projects.filter(filtro);
  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }
  req.project = project;
  return next();
}

//Checa se o Id Foi Preenchido
function checkIdExists(req, res, next) {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ error: 'Id is required' });
  return next();
}

//Checa se o Title Foi Preenchido
function checkTitleExists(req, res, next) {
  const { title } = req.body;
  if (!title)
    return res.status(400).json({ error: 'Title is required' });
  return next();
}

//Cadastrar Projeto
server.post('/projects', checkIdExists, checkTitleExists, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title });
  return res.json(projects);
});

//Listar Projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Editar Projeto
server.put('/projects/:id', checkProjectExists, checkTitleExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  var filtro = (p) => p.id == id;
  const index = projects.findIndex(filtro);
  if (index !== undefined) {
    projects[index].title = title;
  }
  return res.json(projects);
});

//Deletar Projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  var filtro = (p) => p.id == id;
  const index = projects.findIndex(filtro);
  if (index !== undefined) {
    projects.splice(index, 1)
  }
  return res.send();
});

//Cadastrar Tarefa Projeto
server.post('/projects/:id/tasks', checkProjectExists, checkTitleExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  var filtro = (p) => p.id == id;
  const index = projects.findIndex(filtro);
  if (index !== undefined) {
    if (projects[0].tasks == undefined)
      projects[0].tasks = [];
    projects[0].tasks.push({ title });
  }
  return res.json(projects);
});

server.listen(3000);