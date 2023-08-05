const express = require('express');
const route = express.Router();
const homeController = require('./controllers/homeController');
const loginController = require('./controllers/loginController');
const contactoController = require('./controllers/contactoController');
const { loginRequired } = require('./middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);

// Rotas de login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);
route.get('/contacto/index', loginRequired, contactoController.index);
route.post('/contacto/register', loginRequired, contactoController.register);
route.get('/contacto/index/:id', loginRequired, contactoController.editIndex);
route.post('/contacto/edit/:id', loginRequired, contactoController.edit);
route.get('/contacto/excluir/:id', loginRequired, contactoController.excluir);
module.exports = route;