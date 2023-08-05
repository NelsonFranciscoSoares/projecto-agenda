const mongoose = require('mongoose');
const validator = require('validator');

const contactoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    apelido: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const contactoModel = mongoose.model('Contacto', contactoSchema);

function Contacto(body) {
    this.body = body;
    this.errors = [];
    this.contacto = null;
}

Contacto.prototype.register = async function(){
    this.valida();
    if(this.errors.length > 0) return;
    this.contacto = await contactoModel.create(this.body);
};

Contacto.prototype.valida = function() {
    this.cleanUp();

    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    if(!this.body.nome) this.errors.push('Nome é um campo obrigatório');
    if(!this.body.email && !this.body.telefone) this.errors.push('Pelo menos um contacto precisa ser enviado: e-mail ou telefone.');
};

Contacto.prototype.cleanUp = function() {
    for(const key in this.body){
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        apelido: this.body.apelido,
        email: this.body.email,
        telefone: this.body.telefone
    };
};

Contacto.prototype.update = async function(id) {
    if(typeof id !== "string") return;
    this.valida();
    if(this.errors.length > 0) return;
    this.contacto = await contactoModel.findByIdAndUpdate(id, this.body, { new: true});
};

// Método estático
Contacto.buscaPorId = async (id) => {
    if(typeof id !== "string") return;
    const contacto = await contactoModel.findById(id);
    return contacto;
};

Contacto.buscaTodos = async() => {
    const contactos = await contactoModel.find().sort({criadoEm: -1});
    return contactos;
};

Contacto.excluir = async(id) => {
    if(typeof id !== "string") return;
    const contacto = await contactoModel.findOneAndDelete({_id: id});
    return contacto;
};

module.exports = Contacto;