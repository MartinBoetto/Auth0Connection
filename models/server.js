const express = require('express');
const cors = require('cors');

class Server {

    constructor(){
     
        this.app = express();
        this.port = process.env.PORT
        this.auth0Path= '/api/auth0';

        //Middleware
        this.middleware();
        console.log('llego');
        //rutas de mi app
        this.routes();

    }

   
    middleware(){
        
        this.app.use( cors());
        //Directorio publico
        //this.app.use( express.static('public'));

        //Lectura y Parse del body
        this.app.use(express.json());

    }


    routes(){
        //armo la ruta para api/usuarios q apute al user.js
        this.app.use(this.auth0Path, require('../routes/auth0.js'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Aplicacion corriendo en puerto:' + this.port);
        });
    }

};

module.exports=Server;