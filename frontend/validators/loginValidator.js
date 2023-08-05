import validator from 'validator';

export default class LoginValidator{
    constructor(formClass){
        this.form = document.querySelector(formClass);
    }

    init = () => {
        if(!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const error = this.validate(e.target);
            if(!error) e.target.submit();
        });
    }

    validate(formElement) {
        const email = formElement.querySelector('input[name="email"]');
        const password = formElement.querySelector('input[name="password"]');
        let error = false;

        if(!validator.isEmail(email.value)) {
            error = true;
            alert('E-mail inválido');
        }

        if(password.value.length < 3 || password.value.length > 50) {
            error = true;
            alert('Senha precisa ter entre 3 e 50 caracteres');
        }

        return error;
    }
}