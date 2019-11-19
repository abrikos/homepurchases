const passportLib = require('../lib/passport');
const mongoose = require("server/db/mongoose");
const logger = require('logat');
const to = require('../lib/to');


module.exports.controller = function (app) {

    async function getUser(req) {
        const user =await mongoose.User.findOne({id: req.session.passport.user.id})
        return user
    }


    app.post('/api/cabinet/user', passportLib.isLogged, (req, res) => {
        mongoose.User.findById(req.session.passport.user._id)
            .populate({path: 'referral', select: mongoose.User.fieldsAllowed.join(' ')})
            .select(mongoose.User.fieldsAllowed.join(' ') + ' username')
            .then(user => {
                if (!user) return res.sendStatus(400)
                logger.info(user)
                res.send(user)
            })
            .catch(error => res.send({error: 500, message: error.message}))
    });

    app.post('/api/user/save', passportLib.isLogged, (req, res) => {
        mongoose.User.findById(req.session.passport.user._id)
            .select(mongoose.User.fieldsAllowed)
            .then(user => {
                if (!user) return res.sendStatus(400);
                for (const field of mongoose.User.fieldsAllowed) {
                    user[field] = req.body[field];
                }
                //if (!Minter.checkAddress(user.address)) return res.send({error:203, message:'Address invalid'});
                user.save()
                    .then(r => res.send({ok: 200}))
                    .catch(error => res.send({error: 500, message: error.message}))

            })
            .catch(error => res.send({error: 500, message: error.message}))
    });


};