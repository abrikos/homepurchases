import Mongoose from "server/db/mongoose";
import moment from "moment";

const passportLib = require('../lib/passport');
const logger = require('logat');
const to = require('../lib/to');

/*

Mongoose.User.create({id: new Date().valueOf(), first_name:'CC cc'})
    .then(referral=>{
        Mongoose.User.findOne({id:14278211})
            .then(parent=>{
                Mongoose.Referral.create({parent, referral})
            })
    });

*/

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

    app.post('/api/cabinet/referrals', passportLib.isLogged, (req, res) => {
        Mongoose.User.findOne({id: req.session.passport.user.id})
            .populate([{
                path: 'referrals',
                populate: ['referral']
            }])
            .then(user => {
                res.send(user.referrals)
            })
    });

    app.post('/api/cabinet/parents', passportLib.isLogged, (req, res) => {
        Mongoose.User.findOne({id: req.session.passport.user.id})
            .populate([{
                path: 'parents',
                populate: ['parent']
            }])
            .then(user => {
                res.send(user.parents)
            })
    });

    app.post('/api/cabinet/group/:gid/attach/:uid', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(406);
        if (!Mongoose.Types.ObjectId.isValid(req.params.uid)) return res.sendStatus(406);
        Mongoose.Group.findOne({_id: req.params.gid, user: req.session.passport.user})
            .catch(error => res.sendStatus(500))
            .then(group => {
                if (!group.members.includes(req.params.uid)) {
                    group.members.push(req.params.uid)
                    group.save()
                }
                res.send(group)
            })
    });

    app.post('/api/cabinet/group/:gid/detach/:uid', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(406);
        if (!Mongoose.Types.ObjectId.isValid(req.params.uid)) return res.sendStatus(406);
        Mongoose.Group.findOne({_id: req.params.gid, user: req.session.passport.user})
            .catch(error => res.sendStatus(500))
            .then(group => {
                group.members = group.members.filter(m => m.toString() !== req.params.uid)
                group.save();
                res.send(group)
            })
    });

    app.post('/api/cabinet/link', passportLib.isLogged, (req, res) => {
        res.send(`${process.env.SITE}/api/invite/${req.session.passport.user._id}`)
    });

    app.post('/api/cabinet/info', passportLib.isLogged, (req, res) => {
        res.send(req.session.passport.user)
    });

    app.post('/api/cabinet/group/view/:id', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(406);
        Mongoose.Group.findOne({_id: req.params.id, user: req.session.passport.user})
            .populate([
                {path: 'members'},
                {path: 'user', populate: [{path: 'referrals', populate: ['referral']},{path: 'parents', populate: ['parent']}]},
            ])
            .then(group => res.send(group))
            .catch(error => res.sendStatus(500))
    });

    app.post('/api/cabinet/group/save/:id', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(406);
        Mongoose.Group.findOne({_id: req.params.id, user: req.session.passport.user})
            .catch(error => res.sendStatus(404))
            .then(group => {
                if (!group) return res.sendStatus(403);
                const fields = ['name', 'description'];
                for (const f of fields) {
                    group[f] = req.body[f]
                }
                group.save()
                    .then(g => res.send(g))
                    .catch(error => {
                        logger.error(error.message)
                        res.sendStatus(500)
                    })
            })

    });

    app.post('/api/cabinet/group/create', passportLib.isLogged, (req, res) => {
        Mongoose.Group.create({name: 'New group ' + moment().format('YYYY-MM-DD HH:mm:ss'), user: req.session.passport.user})
            .then(group => res.send(group))
            .catch(error => {
                logger.error(error.message);
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
