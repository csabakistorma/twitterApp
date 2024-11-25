/*
    fogadjuk user új jelszó kérelmét. Kaptuk egy id és egy secretet, ezt kell felhasználni
    - 2 megadott jelszó eggyezés vizsgálata
    - secret és id ellenőrzés
    - az új jelszót is tikositani kell
    - hibakezelés??????????????????????????????????????????????????????????????????????????????????????

*/


const bcrypt = require('bcryptjs');

module.exports = function (objRepo) {
    const { userModel, saveDB } = objRepo;

    return async (req, res, next) => {
        const { id, secret } = req.params;
        console.log(id + " / " + secret);

        const { password, 'password-again': passwordAgain } = req.body;

        // Ellenőrizzük, hogy a két jelszó megegyezik-e
        if (password !== passwordAgain) {
            return res.redirect('/login?error=Passwords do not match. Please try again');
        }

        // Ellenőrizzük, hogy a felhasználó és a secret érvényes-e
        const user = await userModel.findOne({ id, secret });

        if (!user) {
            return res.redirect('/login?error=Invalid or expired secret. Please request a new password reset link');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.secret = false;

        await userModel.update(user);

        await saveDB(next);
        console.table(userModel.find());

       
        return res.redirect('/login?completeReset=Your password has been successfully reset');
    };
};
