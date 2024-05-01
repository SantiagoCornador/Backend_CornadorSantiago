import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars'

import carritosRouter from './routes/carts.js';
import __dirname from './utils.js';
import { default as productsRouter, io } from './routes/products.js';

const app = express();
const server = createServer(app);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/', productsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', carritosRouter);
app.use('/realtimeproducts', productsRouter); 

io.attach(server);  


const PORT = 8080
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
