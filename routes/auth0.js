const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { tokenGet, tokenValidate, tokenGetCuston } = require('../controllers/auth0');
const { validarJWT, validateField, validarJWTRS256 } = require('../middleware/validar-jwt');






router.post('/token',
    [
        //check('id','No es un Id valido').isMongoId(),
        //check('id').custom(existId),
        //validateField
    ],
    tokenGet) ;
    //tokenGetCuston);

router.post('/token/validate',
    [
        //check('id','No es un Id valido').isMongoId(),
        //check('id').custom(existId),
        //validarJWT,
        validarJWTRS256,
        validateField
    ],
    tokenValidate) ;



module.exports = router;