require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

mongoose.connect("mongodb://localhost:27017/UsersDB")

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//ENV
const secret = process.env.SECRET;



const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});



userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get('/', function (req, res) {
    res.render("home");
});

app.get('/register', function (req, res) {
    res.render("register");
});

app.get('/login', function (req, res) {
    res.render("login");
});


app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login",function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function (err, foundUser) {
        if (err) {
            res.send(err)
        } else {
            if (foundUser) {
                if (foundUser.password == password) {
                    res.render("secrets");
                }
            }
        }
    })
})

port = process.env.PORT;
if (port == null || port == '') {
    port = 5500;
}

app.listen(port, function () { 
    console.log('server Started on Port', port);
});