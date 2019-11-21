import Mongoose from "server/db/mongoose";
import moment from "moment";
const passportLib = require('../lib/passport');
const logger = require('logat');

/*

Mongoose.User.create({id: new Date().valueOf(), first_name:'CC cc'})
    .then(referral=>{
        Mongoose.User.findOne({id:14278211})
            .then(parent=>{
                Mongoose.Referral.create({parent, referral})
            })
    });

*/

//Mongoose.User.find()    .then(g=>console.log(g))

//Mongoose.Referral.deleteMany({}).then(console.log)
//Mongoose.User.deleteMany({id:{$ne:14278211}}).then(console.log)
//Mongoose.Group.deleteMany({}).then(console.log);Mongoose.Group.deleteMany({}).then(console.log);Mongoose.Message.deleteMany({}).then(console.log);

module.exports.controller = function (app) {

    app.post('/api/group/:pid/save', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(406);
        Mongoose.User.findById(req.session.userId)
            .then(owner => {
                Mongoose.Group.findOne({_id: req.params.pid, owner})
                    .then(group => {
                        if (!group) return res.sendStatus(404);
                        const fields = ['name'];
                        for (const f of fields) {
                            group[f] = req.body[f];
                        }
                        group.save()
                            .then(p => res.send(p))
                            .catch(error => {
                                logger.error(error.message);
                                res.sendStatus(500)
                            });
                    })
            })
    });

    app.post('/api/group/:pid/owner-view', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(406);
        Mongoose.User.findById(req.session.userId)
            .then(owner => {
                Mongoose.Group.findOne({_id: req.params.pid, owner})
                    .populate([
                        {path: 'owner', populate: ['referrals', 'parents']},
                        {path: 'members'},
                    ])
                    .then(group => {
                        if (!group) return res.sendStatus(404);
                        res.send(group)
                    })
            })
    });


    async function createGroup(group, user) {
        const p = await Mongoose.Group.create({group, name: moment().format('YYYY-MM-DD HH:mm:ss')})
        const text = `Group "${group.name}". New group created by ${user.first_name}. ${process.env.SITE}/group/${p.id}`;
        Mongoose.Message.create({text, user});
        for (const user of group.members) {
            Mongoose.Message.create({text, user});
        }
        return p;
    }

    app.post('/api/group/create', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.userId)
            .then(owner => {
                Mongoose.Group.create({owner, name: moment().format('YYYY-MM-DD HH:mm:ss')})
                    .catch(error => {
                        res.send({error: 500, message: error.message})
                    })
                    .then(p => {
                        res.send(p)
                    });
            })
    });

    app.post('/api/group/last', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.userId)
            .then(user => {
                const query = {$or: [{user}, {members: {$in: [user]}}]};
                Mongoose.Group.find(query)
                    .sort({createdAt: -1})
                    .then(ps => {
                        res.send(ps[0])
                    });

            })
    });

    app.post('/api/group/list/user', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.userId)
            .populate('group')
            .then(owner => {
                const query = {$or: [{owner}, {members: {$in: [owner]}}]};
                Mongoose.Group.find(query)
                    .sort({createdAt: -1})
                    .then(groups => {
                        res.send({
                            my: groups.filter(g => g.owner.toString() === owner._id.toString()),
                            invited: groups.filter(g => g.owner.toString() !== owner._id.toString()),
                        })
                    });
            })
    });

    app.post('/api/group/:pid/attach-user/:uid', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(406);
        if (!Mongoose.Types.ObjectId.isValid(req.params.uid)) return res.sendStatus(406);
        Mongoose.Group.findOne({_id: req.params.pid, owner: req.session.passport.user})
            .catch(error => res.sendStatus(500))
            .then(group => {
                if (!group) return res.send({error: 500, message: 'no group found'});
                Mongoose.User.findById(req.params.uid)
                    .then(user => {
                        if (!user) return res.send({error: 500, message: 'no user found'})
                        if (!group.members.includes(user._id)) {
                            group.members.push(user)
                            group.save();
                            const text = `You are invited to group ${process.env.SITE}/group/${group.id}`;
                            Mongoose.Message.create({text, user})
                        }
                        res.send(group)
                    })

            })
    });

    app.post('/api/group/:pid/detach-user/:uid', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(406);
        if (!Mongoose.Types.ObjectId.isValid(req.params.uid)) return res.sendStatus(406);
        Mongoose.Group.findOne({_id: req.params.pid, owner: req.session.passport.user})
            .catch(error => res.sendStatus(500))
            .then(group => {
                group.members = group.members.filter(m => m.toString() !== req.params.uid)
                group.save();
                res.send(group)
            })
    });



};
