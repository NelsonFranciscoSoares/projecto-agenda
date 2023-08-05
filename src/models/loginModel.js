const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const loginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const loginModel = mongoose.model('Login', loginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.valida();
        if(this.errors.length > 0) return;

        await this.userExists();
        if(this.errors.length > 0) return;

        const salt = await bcrypt.genSalt();
        this.body.password = await bcrypt.hash(this.body.password, salt);
        this.user = await loginModel.create(this.body);
    }

    async login() {
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await loginModel.findOne({email: this.body.email });

        if(!this.user){
            this.errors.push('Utilizador não existente');
            return;
        }

        if(!await bcrypt.compare(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        }
    }

    valida() {
        this.cleanUp();

        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

        if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('Senha precisa ter entre 3 e 50 caracteres');
    }

    async userExists() {
        this.user = await loginModel.findOne({email: this.body.email});
        if(this.user) this.errors.push('Utilizador já existente');
    }

    cleanUp() {
        for(const key in this.body){
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;