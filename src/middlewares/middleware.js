module.exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
};

module.exports.checkCsrfError = (err, req, res, next) => {
    if (err){
        return res.render('404');
    }

    next();
};

module.exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

module.exports.loginRequired = (req, res, next) => {
    if(!req.session.user){
        req.flash('errors', 'Precisa realizar login.');
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();
};