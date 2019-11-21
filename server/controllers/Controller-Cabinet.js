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

    app.post('/api/cabinet/group/list', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.passport.user._id)
            .catch(error => {
                logger.error(error);
                res.sendStatus(403)
            })
            .then(user => {
                const query = {$or: [{user}, {members: {$in: [user]}}]};
                Mongoose.Group.find(query)
                    .then(groups => {
                        res.send({
                            default:user.group,
                            my: groups.filter(g => g.user.toString() === user._id.toString()),
                            invited: groups.filter(g => g.user.toString() !== user._id.toString()),
                        })
                    });
            })
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
                {path: 'user', populate: [{path: 'referrals', populate: ['referral']}, {path: 'parents', populate: ['parent']}]},
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

    app.post('/api/cabinet/user/update/default-group', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.passport.user._id)
        //.populate({path: 'referral', select: Mongoose.User.fieldsAllowed.join(' ')})
        //.select(Mongoose.User.fieldsAllowed.join(' ') + ' username')
            .then(user => {
                logger.info(user)
                if (!user) return res.sendStatus(403)
                Mongoose.Group.findById(req.body.id)
                    .then(group => {

                        if (!group) return res.sendStatus(200);
                        user.group = group;
                        user.save()
                            .then(() => res.sendStatus(200))
                            .catch(error => {
                                logger.error(error.message);
                                res.sendStatus(500)
                            })
                    })
                    .catch(error => {
                        logger.error(error.message);
                        res.sendStatus(500)
                    })


            })
            .catch(error => res.send({error: 500, message: error.message}))
    });


};
