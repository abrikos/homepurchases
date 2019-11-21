import Mongoose from "server/db/mongoose";
import moment from "moment";
const passportLib = require('../lib/passport');
const logger = require('logat');


module.exports.controller = function (app) {

    app.post('/api/cabinet/referrals', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.userId)
            .populate([{
                path: 'referrals',
            }])
            .then(user => {
                res.send(user.referrals)
            })
    });

    app.post('/api/cabinet/parents', passportLib.isLogged, (req, res) => {
        Mongoose.User.find({referrals: {$in: req.session.userId}})
            .then(users => {
                res.send(users)
            })
    });


    app.post('/api/cabinet/link', passportLib.isLogged, (req, res) => {
        res.send(`${process.env.SITE}/api/invite/${req.session.userId}`)
    });

    app.post('/api/cabinet/info', passportLib.isLogged, (req, res) => {
        res.send(req.session.passport.user)
    });


};
