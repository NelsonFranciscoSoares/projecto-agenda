const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.CONNECTIONSTRING)
        .then(() => {
            console.log('Conectei à base de dados');
            app.emit('ready');
        })
        .catch(e => console.log(e));

const session = require('express-session'); // uso de sessão
const MongoStore = require('connect-mongo'); // sessão será armazenada no MongoDB
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { inicieiAquiMiddleware, checkCsrfError, csrfMiddleware, middlewareGlobal } = require('./middlewares/middleware');

app.use(helmet());
// para fazer handle de requets http post
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '..', 'public'))); // pasta de conteúdo estático

const sessionOptions = session({
    secret: 'Password1234!',
    store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname,'..', 'src', 'views')); //indicar onde estão as minhas views (caminho absoluto)
app.set('view engine', 'ejs');

app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes); //registar rotas para o express

const port = 3000;

app.on('ready', () => {
    app.listen(port, () => {
        console.log(`Link: http://localhost:${port}`);
        console.log(`Servidor executando na porta ${port}`);
    });
});
