/*
    Ez gyakorlatilag az új jelszó igénylő
    - a megadott email alapján ellenőrizzük, hogy van-e ilyeb email cim
    - secretet generálunk (uuid)
    - átadjuk a user id-t és a secretet további használatra
*/

module.exports = function (objRepo) {
    const { userModel, uuid, saveDB } = objRepo;
    return async (req, res, next) => {
        const { email } = req.body;

        // Ellenőrizzük, hogy létezik-e a felhasználó az adott email címmel
        const user = await userModel.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            // Ha nincs ilyen felhasználó, visszairányítjuk a 'forgotpw' oldalra hibával
            return res.render('forgotpw', { error: 'No account found with that email address' });
        }

        // Generáljuk a titkos kulcsot
        user.secret = uuid.v4();

        // Frissítjük a felhasználó adatokat az új titkos kulccsal
        userModel.update(user);
        await saveDB(next);

        console.table(userModel.find());

        // Logoljuk a címzettet és a generált secret-et
        console.log(`Use this link: http://localhost:3000/resetpw/${user.id}/${user.secret}`);

        console.log(user.id + " / " + user.secret);

        return res.render('resetpw', {
            id: user.id,
            secret: user.secret
        }); 
    };
};
