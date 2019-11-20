import Mongoose from "server/db/mongoose";

const passportLib = require('server/lib/passport');
const passport = require('passport');
const logger = require('logat');
const moment = require('moment');
const to = require('server/lib/to')

module.exports.controller = function (app) {

    app.post('/api/status', (req, res) => {
        res.send({ok: 200})
    });

    app.post('/api/loginFail', (req, res) => {
        res.send({error: "Login fail"})
    });

    app.post('/api/logout', (req, res) => {
        req.session.destroy(function (err) {
            res.send({ok: 200})
        });
    });

    app.get('/api/invite/:id', (req, res) => {
        if (Mongoose.Types.ObjectId.isValid(req.params.id)) {
            Mongoose.User.findById(req.params.id)
                .then(parent => {
                    if (req.session.passport) {
                        const query = {referral: req.session.passport.user, parent};
                        Mongoose.Referral.findOne(query)
                            .then(ref => {
                                if (ref) return;
                                Mongoose.Referral.create(query)
                            });
                        return res.redirect('/cabinet');
                    } else {
                        res.cookie('parentUser', parent.id, {maxAge: 900000, httpOnly: true});
                        return res.redirect('/login');
                    }
                })
        }
    });

    app.post('/api/site-name', (req, res) => {
        res.send({site: process.env.SITE})
    });

    app.post('/api/bot-name', (req, res) => {
        res.send({botName: process.env.BOT_NAME})
    });

    app.get('/api/login/telegram', passport.authenticate('telegram'), (req, res) => {
        if (Mongoose.Types.ObjectId.isValid(req.cookie.parentUser)) {
            Mongoose.User.findById(req.cookie.parentUser)
                .then(parent => {
                    const query = {referral: req.session.passport.user, parent};
                    Mongoose.Referral.findOne(query)
                        .then(ref => {
                            if (ref) return;
                            Mongoose.Referral.create(query)
                        });
                    return res.redirect('/cabinet');

                })
        }
        res.redirect('/cabinet')
    });

    app.post('/api/login/test', passport.authenticate('test'), (req, res) => {
        res.send({ok: 200})
    });


    app.post('/api/isAuth', passportLib.isLogged, async (req, res) => {
        //const [error, user] = await to( Mongoose.User.findById(req.session.passport.user.id));
        //if (!MinterWallet.checkAddress(user.address)) return res.send({error: 412, message:"No wallet's address", authenticated: true})
        res.send({authenticated: true})
    });


};
