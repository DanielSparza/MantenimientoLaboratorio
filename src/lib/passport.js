const { body } = require("express-validator");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("../lib/helpers.js");

passport.use("local.signin", new LocalStrategy({
    usernameField: "usuario",
    passwordField: "contrasena",
    passReqToCallback: true
}, async (req, usuario, contrasena, done) => {
    const rows = await pool.query("SELECT * FROM users WHERE usuario = ?", [usuario]);
    if (rows.length > 0){
        const user = rows[0]; 
        const validarPassword = await helpers.compararContrasena(contrasena, user.contrasena);
        if (validarPassword){
            done(null, user, req.flash("success","Bienvenido " + user.usuario));
        } else {
            done(null, false, req.flash("message","Contraseña incorrecta."));
        }
    } else {
        return done(null, false, req.flash("message","El nombre de usuario no existe."));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {
    const rows = await pool.query("SELECT * FROM users WHERE id_usuario = ?", [id_usuario]);
    done(null, rows[0]);
});