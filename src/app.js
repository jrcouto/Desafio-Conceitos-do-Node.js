const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4'); 

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Middleware
function validateProjectId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
      return response.status(400).json({ error: 'Invalid project ID. '});
  }

  return next();
}

app.use('/projects/:id', validateProjectId); //forma de usar um middleware só para determinadas requisições (que seguem o padrão informado)
app.use('/projects/:id/like', validateProjectId); //forma de usar um middleware só para determinadas requisições (que seguem o padrão informado)

app.get("/repositories", (request, response) => {
  return response.json(repositories); 
}); 

app.post("/repositories", (request, response) => {
  const { url, title, techs }  = request.body;

  const repository = { id:uuid(), url, title, techs, likes:0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {url, title, techs }  = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) { // se não encontrou o indice
      return response.status(400).json({ error: 'Repository not found!'})
  }

  const { likes } = repositories[repositoryIndex];

  const repository = {
      id,
      title,
      url, 
      techs,
      likes
  }; 

  repositories[repositoryIndex] = repository;

  return response.json(repository); 
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) { // se não encontrou o indice 
      return response.status(400).json({ error: 'Repository not found!'})
  }

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) { // se não encontrou o indice
      return response.status(400).json({ error: 'Repository not found!'})
  }

  const repository = repositories[repositoryIndex];
  if(repository.likes!=undefined){
    repository.likes = repository.likes + 1;
  }
  repositories[repositoryIndex] = repository; 

  return response.json(repository); 
});

module.exports = app;
