//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const mongooseEncryption = require("mongoose-encryption");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/secrets", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});




userSchema.plugin(mongooseEncryption, { secret: process.env.secret, encryptedFields: ["password"] });
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) { res.render("home"); });

app.get("/register", function (req, res) {
    res.render("register");

});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) { if (!err) { res.render("secrets"); } else { console.log(err); } });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, function (err, result) {
        if (err) { console.log(err); }
        else {
            if (result) {
                if (result.password === password) { res.render("secrets"); console.log(result); }

            } else { console.log("No such entry found"); }
        }
    });
});

app.get("/login", function (req, res) { res.render("login"); });


app.listen(3000, function () { console.log("Successfully started on port 3000"); });