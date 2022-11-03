
const { response, request } = require('express');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const { jwtVerify} = require('jose');
const req = require('express/lib/request');




const validarJWT = async (req =  request, res=response, next)=>{
    console.log('Middleware de validacion de token');

    const token = req.header('Authorization');
   
    // con jsonwebtoken
    try{
        const decodedToken = jwt.decode(token, {complete: true});
        console.log(decodedToken.header.alg) // bar
        const isValid =  jwt.verify(token,decodedToken.header.alg, process.env.CLIENT_SECRET );
        console.log(isValid);
        next();
         //,{ algorithms: [decodedToken.header.alg] });
    } 

    //con libreria jose
    /*
    try{
        const encoder = new TextEncoder();
        const isValid =  await jwtVerify(token,encoder.encode(process.env.CLIENT_SECRET)) ;
        console.log(isValid);
        next();
    }*/
    catch(er)
    {
        console.log(er);
        return res.status(401).json({
            err:er
        });
    }
    
}

//VAlida token generados con el algoritmo RS256
const validarJWTRS256 = async (req = request, res, next ) =>{

    const token = req.header('Authorization');
    var client = jwksClient({
      jwksUri: 'https://login-dev.gruposancorseguros.com/.well-known/jwks.json'
    });

    function getKey(header, callback){
      client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    }
    
    var options={
        algorithms:["RS256"],
        audience:process.env.CLIENT_ID_CEIBO
    }

    jwt.verify(token, getKey, options, function(err, decoded) {
        try{
            if(decoded){
                console.log(decoded) // bar
                next();

            }
            else{
                
                if(err.name = 'TokenExpiredError'){
                    const messages ={
                        "status":"64",
                        "code":`GSS-401-002`,
                        "text":err.message,
                        "help":`Token expirado en ${err.expiredAt}`
                    };

                    return res.status(401).json({
                        messages
                    });
                }
            }
        }catch(err){
            console.log("error:",err.name);
            const messages ={
                "status":"64",
                "code":`GSS-401-002`,
                "text":err.message,
                "help":`Error interno`
            };
            return res.status(401).json({
                messages
            });
        }
    });


    
}



const validateField = (req, res, next)=>{

    //obtengo los errores q capturo en el user.js del router
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    };

    next();

}

module.exports={
    validarJWT,
    validateField,
    validarJWTRS256
}