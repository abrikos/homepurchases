import Mongoose from "server/db/mongoose";

const passportLib = require('../lib/passport');
const logger = require('logat');
const to = require('../lib/to');


module.exports.controller = function (app) {
    async function getUser(req) {
        const user = await Mongoose.User.findOne({id: req.session.passport.user.id})
        return user
    }

    app.post('/api/cabinet/tab/:tab', passportLib.isLogged, (req, res) => {

        switch (req.params.tab) {
            case 'link':
                res.send({content: 'TODO LINK'});
                break;
            case 'group':
                Mongoose.Group.find({user: req.session.passport.user})
                    .then(groups => {
                        res.send(groups)
                    });
                break;
            default:
                res.send({ok: 200})
        }

    });

    app.post('/api/cabinet/group/update/:id', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(406);
        Mongoose.Group.findOne({_id: req.params.id, user: req.session.passport.user})
            .catch(error => res.sendStatus(404))
            .then(group => {
                if (!group) return res.sendStatus(403);
                group[req.body.field] = req.body.value;
                group.save()
                    .then(() => res.sendStatus(200))
                    .catch(error => {
                        logger.error(error.message)
                        res.sendStatus(500)
                    })
            })

    });

    app.post('/api/cabinet/group/create', passportLib.isLogged, (req, res) => {
        Mongoose.Group.create({name: req.body.name, user: req.session.passport.user})
            .then(group => res.send({ok: 200, group}))
            .catch(error => {
                //logger.error(error.message);
                //console.log(error.errors)
                res.sendStatus(500)
                //res.send({error:500, message:error.message})
            })
    });

    app.post('/api/cabinet/user', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.passport.user._id)
            .populate({path: 'referral', select: Mongoose.User.fieldsAllowed.join(' ')})
            .select(Mongoose.User.fieldsAllowed.join(' ') + ' username')
            .then(user => {
                if (!user) return res.sendStatus(400)
                logger.info(user)
                res.send(user)
            })
            .catch(error => res.send({error: 500, message: error.message}))
    });

    app.post('/api/user/save', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.passport.user._id)
            .select(Mongoose.User.fieldsAllowed)
            .then(user => {
                if (!user) return res.sendStatus(400);
                for (const field of Mongoose.User.fieldsAllowed) {
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