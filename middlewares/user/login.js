/*
    - Bevitt adatok alapján felhasználó keresés
    - Hibakezelés ha nincs találat
    - bcrypt - titkositott jelszó ellenőrzés
    - session beállitás
*/

const bcrypt = require('bcryptjs');

module.exports = function (objRepo) {
    const { userModel } = objRepo;

    return (req, res, next) => {
        // Ellenőrizzük, hogy megadták-e a szükséges adatokat
        if (typeof req.body.username === 'undefined' || typeof req.body.password === 'undefined') {
            return res.redirect('/login');
        }

        console.log(req.body.username);
        console.log(req.body.password);

        // Felhasználó keresése az adatbázisban
        const user = userModel.findOne({
            username: req.body.username.trim()
        });

        if (!user) {
            console.log("Hibás felhasználónév");
            return res.render('login', { error: 'Incorrect username or password' });
        }

        // A titkosított jelszó ellenőrzése
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Hiba történt a jelszó összehasonlításakor:", err);
                return res.render('login', { error: 'Error during login attempt' });
            }

            if (!isMatch) {
                console.log("Hibás jelszó");
                return res.render('login', { error: 'Incorrect username or password' });
            }

            // Ha sikeres a bejelentkezés, beállítjuk a session-t
            req.session.userid = user.id;
            req.session.username = user.username;

            // Mentsük el a session-t
            return req.session.save(err => {
                if (err) {
                    return next(err);
                }
                console.log("Sikeres bejelentkezés! A session-ban tárolt felhasználói ID: ", req.session.userid, req.session.username);
                return res.redirect('/');
            });
        });
    };
};
