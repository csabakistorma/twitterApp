/*
    Egyesével ellenőrizzük, hogy a megadott Email vagy jelszó létezik/lefoglalték-e már.
    Ha valamelyikre is van találat visszaküldjük a hibaüzenetet

    Felhasználható: - Regisztrációnál
                    - A profil módositásnál ha a felhasználó Email, vagy felhasználó nevet akar változtatmi
*/

module.exports = function (objRepo) {
    const { userModel } = objRepo;

    return (req, res, next) => {
        if (!req.body.email || !req.body.username) {
            return next();
        }

        // Ellenőrizzük, hogy létezik-e már felhasználó ugyanazzal az email címmel
        const existingEmail = userModel.findOne({ email: req.body.email.trim().toLowerCase() });
        if (existingEmail) {
            return res.render('reg', {
                error: req.body.email + ' is already taken',
            });
        }

        // Ellenőrizzük, hogy létezik-e már felhasználó ugyanazzal a felhasználónévvel
        const existingUsername = userModel.findOne({ username: req.body.username.trim() });
        if (existingUsername) {
            return res.render('reg', {
                error: req.body.username + ' is already taken',
            });
        }

        return next();
    };
};
