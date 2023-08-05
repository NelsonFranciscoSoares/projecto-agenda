const Contacto = require('../models/contactoModel');

exports.index = async (req, res) => {
    const contactos = await Contacto.buscaTodos();
    res.render('index', { contactos });
}