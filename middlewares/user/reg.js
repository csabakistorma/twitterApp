/*
    - bevitt adatok ellenőrzése
    - bcrypt titkositás a jelszóra
    - egyedi azonositó a usernek
    - mentés az adatbázisba
    - hibakezelés
*/


const bcrypt = require('bcryptjs');

module.exports = function (objRepo) {
    const { userModel, uuid, saveDB } = objRepo;
    return (req, res, next) => {
        // Ellenőrizzük, hogy a kötelező mezők megvannak-e
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Email és jelszó szükséges!');
        }

        try {
            // Jelszó titkosítása bcrypt segítségével
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Hiba történt a jelszó titkosítása közben:', err);
                    return res.status(500).send('Hiba történt a regisztráció során.');
                }
                
                const currentDate = new Date();

                // Felhasználó létrehozása a titkosított jelszóval
                userModel.insert({
                    id: uuid.v4(),
                    username: req.body.username,
                    email: req.body.email.trim().toLowerCase(),
                    password: hashedPassword,
                    profileImg: '',
                    secret: false,
                    createDate: currentDate.toISOString().split('T')[0],
                    updateDate: '',
                    activeStatus: true,
                    admin: false
                });

                // Adatbázis mentése
                saveDB((err) => {
                    if (err) {
                        console.error('Hiba a mentés közben:', err);
                        return res.status(500).send('Hiba történt a regisztráció során.');
                    }

                    // Sikeres regisztráció után átirányítás a login oldalra
                    return res.redirect('/login');
                });
            });
        } catch (err) {
            console.error('Regisztrációs hiba:', err);
            return res.status(500).send('Hiba történt a regisztráció során.');
        }
    };
};
