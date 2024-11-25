const uuid = require('uuid');
const path = require('path');

// Middleware-ek importálása
const regMW = require('../middlewares/user/reg');
const loginMW = require('../middlewares/user/login');
const authMW = require('../middlewares/user/auth');
const logoutMW = require('../middlewares/user/logout');
const checkEmailAndUsernameMW = require('../middlewares/user/checkEmailAndUsername');
const sendForgotMW = require('../middlewares/user/sendForgotPw');
const resetPwMW = require('../middlewares/user/resetpw');
const renderMW = require('../middlewares/render');

module.exports = function (app, { userModel, saveDB }) {
    const objRepo = {
        userModel,
        uuid,
        saveDB
    };

    app.use(authMW(objRepo));

    // Regisztráció screen
    app.get('/register',
        renderMW(objRepo, 'reg'));

    // Regisztráció
    app.post('/register',
        checkEmailAndUsernameMW(objRepo),
        regMW(objRepo)
    );

    // Login screen
    app.get('/login', (req, res) => {
        const completeReset = req.query.completeReset;
        const error = req.query.error;
        res.render('login', { completeReset, error });
    });

    // Login
    app.post('/login',
        loginMW(objRepo), (req, res) => {
            res.redirect('/');
        });

    // Kilépés
    app.get('/logout', logoutMW(objRepo))

    // Elfelejtett jelszó kérés
    app.get('/forgotpw',
        renderMW(objRepo, 'forgotpw'));

    // Elfelejtett jelszó kezelése
    app.post('/forgotpw',
        sendForgotMW(objRepo));

    // Jelszó reset
    app.get('/resetpw/:id/:secret', (req, res, next) => {
        const error = req.query.error;
        const { id, secret } = req.params; 
    
        res.locals.id = id;
        res.locals.secret = secret;
        res.locals.error = error;
    
        renderMW(objRepo, 'resetpw');
    });

    // Jelszó resetelés
    app.post('/resetpw/:id/:secret',
        resetPwMW(objRepo));

    // Kezdőlap (index) oldal renderelése
    app.get('/', renderMW(objRepo, 'index'));


    return app;
};
