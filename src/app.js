const express = require('express');
const fs = require('fs').promises;
const handlebars = require('express-handlebars');
const socketIo = require('socket.io');
const handlebarsInstance = handlebars.create();


const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
const io = socketIo(server);

app.engine('handlebars', handlebarsInstance.engine);

app.set('views', __dirname + '/src/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/src/public'));
app.use(express.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

const productosRouter = require('./routes/products');
app.use('/api/products', productosRouter);

const carritosRouter = require('./routes/carts');
app.use('/api/carts', carritosRouter);


io.on('connection', (socket) => {
    console.log('Cliente conectado');
});
