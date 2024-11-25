/*
    Az kezdőlap betöltésekor már ellenőrizzük, hogy a felhasználó be van-e jelentkezve
    Kezdőértéknek beáláitottam egy isLoggedIn = false-t az ejs template logikához.
    Ha bejelentkezett hozzáférünk a username-hez és az isLoggedIn = true segit nekünk a frontenden
*/

module.exports = function (objRepo) {
    return (req, res, next) => {
        // Az isLoggedIn alapértelmezett értéke false
        res.locals.isLoggedIn = false;

        // Ha a session tartalmazza a felhasználó id-ját, akkor beállítjuk az isLoggedIn-t true-ra
        if (typeof req.session.userid !== 'undefined') {
            res.locals.isLoggedIn = true;
            res.locals.username = req.session.username;
        }

        return next();
    };
};
