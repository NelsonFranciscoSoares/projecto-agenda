import 'core-js/stable';
import 'regenerator-runtime/runtime';
import MyLoginValidator from './validators/loginValidator';

const registoValidator = new MyLoginValidator('.form-registo');
const loginValidator = new MyLoginValidator('.form-login');
registoValidator.init();
loginValidator.init();