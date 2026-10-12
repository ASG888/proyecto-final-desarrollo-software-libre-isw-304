const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// 1. LEER y BUSCAR contactos
app.get('/', (req, res) => {
    const busqueda = req.query.q || '';
    const sql = `SELECT * FROM contactos WHERE nombre LIKE ? OR telefono LIKE ?`;
    db.all(sql, [`%${busqueda}%`, `%${busqueda}%`], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.render('index', { contactos: rows, busqueda });
    });
});

// Formulario para nuevo contacto
app.get('/nuevo', (req, res) => {
    res.render('nuevo');
});

// 2. CREAR contacto
app.post('/agregar', (req, res) => {
    const { nombre, telefono, email } = req.body;
    const sql = `INSERT INTO contactos (nombre, telefono, email) VALUES (?, ?, ?)`;
    db.run(sql, [nombre, telefono, email], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al guardar el contacto");
        }
        res.redirect('/');
    });
});

// 3. ELIMINAR contacto
app.post('/eliminar/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM contactos WHERE id = ?`;
    db.run(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al eliminar el contacto");
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
