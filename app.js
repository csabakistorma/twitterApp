const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const {initDB} = require('./services/db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '1geerge3gre3333gcsk',
    resave: false,
    saveUninitialized: true
}));

initDB((err, {userModel, tweetModel, imageModel, likeModel, saveDB}) => {
    if (err) {
        return console.log("App cannot start", err);
    }

     require('./router')(app, { userModel, saveDB });
     app.listen(3000, () => {
         console.log(`Server running on port 3000`);
     });
});