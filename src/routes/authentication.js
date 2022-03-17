const express = require("express");
const router = express.Router();
const passport = require("passport");
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");
const helpers = require("../lib/helpers.js");

router.get("/signin", isNotLoggedIn, async (req, res) => {
    //VERIFICA SI NO HAY NINGUN ADMIN REGISTRADO EN LA TABLA Y REGISTRA UNO GENERICO
    const rows = await pool.query("SELECT * FROM users WHERE fk_rol = 1;");
    if(rows.length < 1){
        var password = "12345";
        const contrasena = await helpers.encriptarContrasena(password);
        await pool.query("INSERT INTO users (usuario, contrasena, email, nombre, fk_rol) VALUES ('admin', '" + contrasena + "', 'N/A', 'N/A', 1);");
        res.render("auth/signin");
    }else{
        res.render("auth/signin");
    }
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local.signin", {
        successRedirect: "/",
        failureRedirect: "/signin",
        failureFlash: true
    })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect("/signin");
});

module.exports = router;