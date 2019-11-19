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

    app.post('/api/bot-name', (req, res) => {
            res.send({botName: process.env.BOT_NAME})
    });

    app.post('/api/login/telegram', passport.authenticate('telegram'), (req, res) => {
        res.send({ok: 200})
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