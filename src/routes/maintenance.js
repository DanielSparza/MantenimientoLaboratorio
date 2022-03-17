const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");
const helpers = require("../lib/helpers.js");

//---------ADMINISTRADORES------------------------------------------------------------------------------

//---------USUARIOS------------------------------------------------------------------------------
router.get("/users", isLoggedIn, async (req, res) => {
    const users = await pool.query("SELECT u.id_usuario, u.nombre, u.usuario, u.email, r.rol FROM users u, rol r WHERE u.fk_rol = r.id_rol");
    const rol = await pool.query("SELECT * FROM rol;");
    res.render("admin/users.hbs", { users, rol });
});

router.post("/usersadd", isLoggedIn, async (req, res) => {
    const { nombre, usuario, email, fk_rol, contrasena } = req.body;
    const usr = {
        user_id: req.user.id_usuario
    }
    const newUser = {
        usuario,
        contrasena,
        email,
        nombre,
        fk_rol,
    };
    newUser.contrasena = await helpers.encriptarContrasena(contrasena);
    await pool.query("INSERT INTO users SET ?", [newUser])
    res.redirect("/maintenance/users");
});

router.post("/usersedit/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const {nombre, usuario, email } = req.body;
    const edituser = {
        nombre,
        usuario,
        email
    };
    await pool.query("UPDATE users SET nombre = '" + edituser.nombre + "', usuario = '" + edituser.usuario + "', email = '" + edituser.email + "' WHERE  id_usuario = " + id + "");
    req.flash("success", "Se modificó el usuario " + id + " correctamente!");
    res.redirect("/maintenance/users");
});


router.get("/usersdelete/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id_usuario = ?", [id]);
    req.flash("success", "Se eliminó el usuario correctamente");
    res.redirect("/maintenance/users");
});

router.post("/usersfilter", isLoggedIn, async (req, res) => {
    const { filtro, usuario } = req.body;
    const users = await pool.query("SELECT u.id_usuario, u.nombre, u.usuario, u.email, r.rol FROM users u, rol r WHERE u.fk_rol = r.id_rol AND u.fk_rol LIKE '%" + filtro + "%' AND u.usuario LIKE '%" + usuario + "%'");
    const rol = await pool.query("SELECT * FROM rol;");
    res.render("admin/users.hbs", { users, rol });
});

//---------LABORATORIOS------------------------------------------------------------------------------
router.get("/laboratories", isLoggedIn, async (req, res) => {
    const labs = await pool.query("SELECT * FROM laboratory");
    const building = await pool.query("SELECT DISTINCT ubicacion FROM laboratory");
    res.render("admin/laboratories.hbs", { labs, building });
});

router.post("/laboratoriesadd", isLoggedIn, async (req, res) => {
    const { ubicacion, descripcion } = req.body;
    const newLab = {
        descripcion,
        ubicacion
    };
    await pool.query("INSERT INTO laboratory SET ?", [newLab]);
    res.redirect("/maintenance/laboratories");
});

router.post("/laboratoriesedit/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { descripcion, ubicacion } = req.body;
    const editLab = {
        descripcion,
        ubicacion
    };
    await pool.query("UPDATE laboratory SET descripcion = '" + editLab.descripcion + "', ubicacion = '" + editLab.ubicacion + "' WHERE  id_laboratorio = " + id + "");
    req.flash("success", "Se modificó el laboratorio " + id + " correctamente!");
    res.redirect("/maintenance/laboratories");
});

router.get("/labsdelete/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM laboratory WHERE id_laboratorio = ?", [id]);
    req.flash("success", "Se eliminó el laboratorio correctamente");
    res.redirect("/maintenance/laboratories");
});

router.post("/labsfilter", isLoggedIn, async (req, res) => {
    const { filtro } = req.body;
    const labs = await pool.query("SELECT * FROM laboratory WHERE ubicacion LIKE '%" + filtro + "%'");
    const building = await pool.query("SELECT DISTINCT ubicacion FROM laboratory");
    res.render("admin/laboratories.hbs", { labs, building });
});

//---------COMPUTADORAS------------------------------------------------------------------------------
router.get("/computers", isLoggedIn, async (req, res) => {
    const pcs = await pool.query("SELECT c.numserie, c.marca, c.monitor, c.memoria, c.procesador, c.tipoconexion, c.estatus, l.descripcion FROM computers c, laboratory l WHERE c.fk_laboratorio = l.id_laboratorio");
    const labs = await pool.query("SELECT id_laboratorio, descripcion FROM laboratory");
    res.render("admin/computers.hbs", { pcs, labs });
});

router.post("/pcsadd", isLoggedIn, async (req, res) => {
    const { numserie, marca, monitor, memoria, procesador, tipoconexion, fk_laboratorio } = req.body;
    await pool.query("INSERT INTO computers (numserie, marca, monitor, memoria, procesador, tipoconexion, estatus, fk_laboratorio)" +
       " VALUES ('" + numserie + "', '" + marca + "', '" + monitor + "', '" + memoria + "', '" + procesador + "', '" + tipoconexion + "', 1, " + fk_laboratorio + ")");
    res.redirect("/maintenance/computers");
});

router.post("/pcsedit/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { marca, monitor, memoria, procesador, tipoconexion, estatus } = req.body;
    await pool.query("UPDATE computers SET marca = '" + marca + "', monitor = '" + monitor + "', memoria = '" + memoria + "', " +
    " procesador = '" + procesador + "', tipoconexion = '" + tipoconexion + "', estatus = " + estatus + " WHERE numserie = '" + id + "'");
    req.flash("success", "Se modificó la computadora " + id + " correctamente!");
    res.redirect("/maintenance/computers");
});

router.get("/pcsdelete/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM computers WHERE numserie = ?", [id]);
    req.flash("success", "Se eliminó la computadora correctamente");
    res.redirect("/maintenance/computers");
});

router.post("/pcsfilter", isLoggedIn, async (req, res) => {
    const { filtro } = req.body;
    const pcs = await pool.query("SELECT c.numserie, c.marca, c.monitor, c.memoria, c.procesador, c.tipoconexion, c.estatus, l.descripcion FROM computers c, laboratory l WHERE c.fk_laboratorio = l.id_laboratorio AND c.fk_laboratorio LIKE '%" + filtro + "%'");
    const labs = await pool.query("SELECT id_laboratorio, descripcion FROM laboratory");
    res.render("admin/computers.hbs", { pcs, labs });
});

//---------TICKETS------------------------------------------------------------------------------
router.get("/tickets", isLoggedIn, async (req, res) => {
    const ticket = await pool.query("SELECT t.id_ticket, t.fk_numserie, u.nombre, t.fecha, t.problema FROM tickets t, users u WHERE t.fk_usuario = u.id_usuario");
    res.render("admin/tickets.hbs", { ticket});
});

router.post("/ticketsfilter", isLoggedIn, async (req, res) => {
    const { nombre } = req.body;
    const ticket = await pool.query("SELECT t.id_ticket, t.fk_numserie, u.nombre, t.fecha, t.problema FROM tickets t, users u WHERE t.fk_usuario = u.id_usuario AND u.nombre LIKE '%" + nombre + "%'");
    res.render("admin/tickets.hbs", { ticket});
});

router.post("/ticketsconfirm/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { tipo } = req.body;
    await pool.query("INSERT INTO maintenance (fk_ticket, tipo, estatus) VALUES (" + id + ", " + tipo + ", 1)");
    req.flash("success", "Se autorizó en ticket de mantenimiento correctamente");
    res.redirect("/maintenance/tickets");
});

router.get("/ticketsreject/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("INSERT INTO maintenance (fk_ticket, estatus) VALUES (" + id + ", 4)");
    req.flash("success", "Se rechazó en ticket de mantenimiento correctamente");
    res.redirect("/maintenance/tickets");
});

//---------MANTENIMIENTOS------------------------------------------------------------------------------
router.get("/maintenance", isLoggedIn, async (req, res) => {
    const mainte = await pool.query("SELECT m.id_mantenimiento, m.fk_ticket, m.tipo, u.nombre, m.estatus, m.observaciones FROM maintenance m, users u, tickets t WHERE m.fk_ticket = t.id_ticket AND t.fk_usuario = u.id_usuario");
    res.render("admin/maintenance.hbs", { mainte });
});

router.post("/maintenancefilter", isLoggedIn, async (req, res) => {
    const { tipo, estatus } = req.body;
    const mainte = await pool.query("SELECT m.id_mantenimiento, m.fk_ticket, m.tipo, u.nombre, m.estatus, m.observaciones FROM maintenance m, users u, tickets t " + 
    "WHERE m.fk_ticket = t.id_ticket AND t.fk_usuario = u.id_usuario AND m.tipo LIKE '%" + tipo + "%' AND m.estatus LIKE '%" + estatus + "%'");
    res.render("admin/maintenance.hbs", { mainte });
});





//---------USUARIOS------------------------------------------------------------------------------

//---------TICKETS------------------------------------------------------------------------------
router.get("/ticketsuser", isLoggedIn, async (req, res) => {
    const usr = {
        user_id: req.user.id_usuario
    };
    const ticket = await pool.query("SELECT t.id_ticket, t.fk_numserie, t.fecha, t.problema FROM tickets t, users u WHERE t.fk_usuario = u.id_usuario AND fk_usuario = " + usr.user_id + "");
    const pcs = await pool.query("SELECT numserie FROM computers");
    res.render("users/tickets.hbs", { ticket, pcs });
});

router.post("/ticketsadd", isLoggedIn, async (req, res) => {
    const { fk_numserie, problema } = req.body;
    const newTicket = {
        fk_numserie,
        problema,
        user_id: req.user.id_usuario
    };
    await pool.query("INSERT INTO tickets (fk_numserie, fk_usuario, problema) VALUES ('" + newTicket.fk_numserie + "'"+
    ", " + newTicket.user_id + ", '" + newTicket.problema + "')");
    req.flash("success", "Se agregó el ticket de mantenimiento correctamente");
    res.redirect("/maintenance/ticketsuser");
});

//---------MANTENIMIENTO------------------------------------------------------------------------------
router.get("/maintenanceuser", isLoggedIn, async (req, res) => {
    const usr = {
        user_id: req.user.id_usuario
    };
    const mainte = await pool.query("SELECT m.id_mantenimiento, m.fk_ticket, m.tipo, u.nombre, m.estatus, m.observaciones"+
    " FROM maintenance m, users u, tickets t WHERE m.fk_ticket = t.id_ticket AND t.fk_usuario = u.id_usuario AND t.fk_usuario = " + usr.user_id + "");
    res.render("users/maintenance.hbs", { mainte });
});

router.post("/maintenanceuserfilter", isLoggedIn, async (req, res) => {
    const { tipo, estatus } = req.body;
    const usr = {
        user_id: req.user.id_usuario
    };
    const mainte = await pool.query("SELECT m.id_mantenimiento, m.fk_ticket, m.tipo, u.nombre, m.estatus, m.observaciones FROM maintenance m, users u, tickets t " + 
    "WHERE m.fk_ticket = t.id_ticket AND t.fk_usuario = u.id_usuario AND t.fk_usuario = " + usr.user_id + " AND m.tipo LIKE '%" + tipo + "%' AND m.estatus LIKE '%" + estatus + "%'");
    res.render("users/maintenance.hbs", { mainte });
});

router.get("/maintenanceuserbegin/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("UPDATE maintenance SET estatus = 2 WHERE id_mantenimiento = " + id +"");
    req.flash("success", "Se inició el mantenimiento " + id + " correctamente!");
    res.redirect("/maintenance/maintenanceuser");
});

router.post("/maintenanceuserend/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { observaciones } = req.body;
    await pool.query("UPDATE maintenance SET estatus = 3, observaciones = '" + observaciones + "' WHERE id_mantenimiento = " + id +"");
    req.flash("success", "Se finalizó el mantenimiento " + id + " correctamente!");
    res.redirect("/maintenance/maintenanceuser");
});

module.exports = router;