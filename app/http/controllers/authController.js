const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customers/orders';
    };
    return {
        login(req, res) {
            return res.render('auth/login');
        },
        postlogin(req, res, next) {
            const { email, password } = req.body;

            if (!email || !password) {
                req.flash('error', 'All Fields are required...');
                req.flash('email', email);
                return res.redirect('/login');
            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err);
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }

                req.logIn(user, (err) => {
                    if (err) {

                        req.flash('error', info.message);
                        return next(err);
                    }
                    return res.redirect(_getRedirectUrl(req));
                })

            })(req, res, next);
        },
        register(req, res) {
            return res.render('auth/register');
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                req.flash('error', 'All Fields are required...');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }

            //check if email is exist or not

            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email is already Exist...');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');

                }
            });

            //hash password using bcrypt
            const hashPassword = await bcrypt.hash(password, 10);
            /// create new user
            const user = new User({
                name,
                email,
                password: hashPassword
            });
            user.save().then(user => {
                //login

                return res.redirect('/');
            }).catch(err => {
                console.log(err);
                req.flash('error', 'Something went wrong...');
                return res.redirect('/register');
            });
            //console.log(req.body);
        },
        logout(req, res) {
            req.logout();
            return res.redirect('/login');
        }
    }
}
module.exports = authController;