const model = require('../models/user');


exports.signup = (req, res) => {
    res.render('./user/new')
};

exports.addUser = (req, res, next) => {
    let user = new User(req.body);
    user.save()
    .then(() => res.redirect('./user/login'))
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('./user/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email address has been used');
            return res.redirect('./user/new');
        }
        next(err);
    });
}

exports.login = (req, res) => {
    console.log(req.flash());
    res.render('./user/login')
};

exports.loginSubmit = (req, res, next) => {
    // authenticate user's login request
    let email = req.body.email;
    let password = req.body.password;
    // get the user that matches email 
    User.findOne({email: email})
    .then(user => {
        if(user) {
            //user found in DB
            user.comparePassword(password)
            .then(result => {
                if(result){
                    req.session.user = user._id; // store user's ID in the session. 
                    req.flash('success', 'You have successfully logged in.')
                    res.redirect('./user/profile');
                } else {
                    req.flash('err', 'Wrong password');
                    res.redirect('./user/login');
                }
            })
            .catch(err => next(err))
        } else {    
            req.flash('err', 'Wrong email address');
            res.redirect('./user/login');
        }
    })
    .catch(err => next(err))
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    console.log(req.flash());
    User.findById(id)
    .then(user => res.render('./user/profile', {user}))
    .catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err=>{
        if (err) 
            return next(err);
        else 
            res.redirect('/');
    });
};