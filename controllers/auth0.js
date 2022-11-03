const { response } = require('express');
const  axios = require("axios").default;
const Token = require("../models/token.js")
const jwt = require('jsonwebtoken');
//var buffer = require('buffer/').Buffer;


//Token desde Auth0
const tokenGet = async(req, res = response)=>{
    
  try{  
        //obtengo los parametros q viene en el body
        const {username, password} = req.body;  //asi obtengo todo el querystring
        //const { } = req.query; //asi desestructuro el querystring y obtengo lo q quiero

        const options = {
            method: 'POST',
            url: process.env.URLGETTOKEN,
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            data: new URLSearchParams({
              grant_type: "http://auth0.com/oauth/grant-type/password-realm",
              username: username,
              password: password,
              //audience: 'BUP',
              realm: process.env.REALM_CEIBO,
              //realm: "BUP",
              scope: 'openid profile',
              client_id:  process.env.CLIENT_ID_CEIBO,
              client_secret:  process.env.CLIENT_SECRET_CEIBO
            })
          };

          const tokenAuth0 = await axios.request(options);
          const {access_token, id_token,scope, expires_in,token_type } =tokenAuth0.data;
          
          const data = {
            access_token ,
            id_token,
            scope,
            expires_in,
            token_type
          };

          const messages ={
            "status":"",
            "code":"GSS-200-002",
            "text":"Ejecución Exitosa",
            "help":""
          };
          //console.log(data);

          
        res.json({
                data,
                messages        
            });
      }
      catch(err){
        const messages ={
          "status":"64",
          "code":`GSS-${err.response.status}-002`,
          "text":err.response.data.error,
          "help":err.response.data.error_description
        };
        res.status(err.response.status).json({messages});
      }
    
};


//token custon
const tokenGetCuston = async(req, res= response) =>{

  const u = {
    username: 'Martin',
    id: '434343'
   }
   const token = jwt.sign(u, process.env.CLIENT_SECRET, {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
   });


   const data = {
    access_token : '',
    id_token : token
    };
  console.log(data);

  
  res.json({
          msg:"Token Ok",
          data        
      });
};


const tokenValidate = async(req, res = response)=>{
  const messages ={
    "status":"0",
    "code":`GSS-200-002`,
    "text":"Token validado Ok",
    "help":``
};
    res.json({
      messages
    });
}




module.exports = {
    tokenGet, tokenValidate, tokenGetCuston
}