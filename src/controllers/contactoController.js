const Contacto = require('../models/contactoModel');

module.exports.index = (req, res) => {
    res.render('contacto', {
        contacto: {}
    });
};

module.exports.register = async (req, res) => {
    try{
        const contacto = new Contacto(req.body);
        await contacto.register();

        if(contacto.errors.length > 0){
            req.flash('errors', contacto.errors);
            req.session.save(() => res.redirect('/contacto/index'));
            return;
        }

        req.flash('success', 'Contacto criado com sucesso');
        req.session.save(() => res.redirect(`/contacto/index/${contacto.contacto._id}`));
        return;
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

module.exports.editIndex = async (req, res) => {
    if(!req.params.id) return res.render('404');

    const contacto = await Contacto.buscaPorId(req.params.id);
    if(!contacto) return res.render('404');

    res.render('contacto', { contacto });
};

module.exports.edit = async (req, res) => {
    try {

        if(!req.params.id) return res.render('404');
        
        const contacto = new Contacto(req.body);
        await contacto.update(req.params.id);

        if(contacto.errors.length > 0){
            req.flash('errors', contacto.errors);
            req.session.save(() => res.redirect(`/contacto/index/${contacto.contacto._id}`));
            return;
        }

        req.flash('success', 'Contacto editado com sucesso');
        req.session.save(() => res.redirect(`/contacto/index/${contacto.contacto._id}`));
        return;
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

module.exports.excluir = async (req, res) => {
    try {

        if(!req.params.id) return res.render('404');

        await Contacto.excluir(req.params.id);

        req.flash('success', 'Contacto removido com sucesso');
        req.session.save(() => res.redirect('/'));
        return;

    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};