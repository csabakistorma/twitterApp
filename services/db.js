const loki = require('lokijs');

function initDB(cb) {
    console.log("Init database...");

    // adatbázis inicializálása
    const db = new loki('database.db');

    db.loadDatabase({}, err => {
        if (err) {
            return cb(err);
        }

        let userModel = db.getCollection("user");
        if (userModel === null) {
            userModel = db.addCollection("user", {
                indices: ["id", "email"],
                unique: ["email"],
                fields: ["id", "username", "email", "password", "profileImg", "secret", "createDate", "updateDate", "activeStatus", "admin"]
            });
            console.log("'user' collection created.");
        }

        let tweetModel = db.getCollection("tweets");
        if (tweetModel === null) {
            tweetModel = db.addCollection("tweets", {
                indices: ["id", "userId"],
                fields: ["id", "userId", "content", "images", "likes", "createDate", "updateDate"]
            });
            console.log("'tweets' collection created.");
        }

        let imageModel = db.getCollection("images");
        if (imageModel === null) {
            imageModel = db.addCollection("images", {
                indices: ["id", "tweetID"],
                fields: ["id", "tweetID", "imageURL", "createDate"]
            });
            console.log("'images' collection created.");
        }

        let likeModel = db.getCollection("likes");
        if (likeModel === null) {
            likeModel = db.addCollection("likes", {
                indices: ["id", "tweetID"],
                fields: ["id", "tweetID", "createDate"]
            });
            console.log("'likes' collection created.");
        }


        // Az adatbázis mentése a változásokkal
        db.saveDatabase(err => {
            if (err) {
                return cb(err);
            }
            console.log("DB saved after init.");

            // Kiíratjuk az összes rekordot
            console.table(userModel.find());
            console.log(tweetModel.find());
            console.log(imageModel.find());

            return cb(undefined, {
                userModel,
                tweetModel,
                imageModel,
                saveDB: (cb) => {
                    console.log("Saving DB...");
                    db.saveDatabase(cb);
                }
            });
        });
    });
}

module.exports = { initDB };
