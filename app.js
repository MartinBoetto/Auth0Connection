const Server = require('./models/server');

require('dotenv').config();

//console.log('inicio');
const server = new Server();
server.listen();