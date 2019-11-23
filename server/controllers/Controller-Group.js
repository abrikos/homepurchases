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

    app.post('/api/group/:gid/save', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(400);
        Mongoose.Group.findById(req.params.gid)
            .catch(error => res.send({error: 500, message: error.message}))
            .then(group => {
                if (!group) return res.sendStatus(406);
                if (group.owner.toString() !== req.session.userId) return res.sendStatus(403)
                const fields = ['name'];
                for (const f of fields) {
                    group[f] = req.body[f];
                }
                group.save()
                    .then(p => res.send(p))
                    .catch(error => res.send({error: 500, message: error.message}))
            })

    });

    function checkAccess(group, userId) {
        const mems = group.members.map(m => (m._id ? m._id : m).toString());
        mems.push((group.owner._id ? group.owner._id : group.owner).toString());
        return mems.includes(userId)
    }

    app.post('/api/group/:gid/view', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(400);
        Mongoose.Group.findById(req.params.gid)
            .populate([
                {path: 'owner'},
                {path: 'members'},
                {path: 'purchases'},
            ])
            .catch(error => res.send({error: 500, message: error.message}))
            .then(group => {
                if (!group) return res.sendStatus(406);
                if (!checkAccess(group, req.session.userId)) return res.sendStatus(403)
                res.send(group)
            })

    });

    app.post('/api/group/:gid/purchases', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(400);
        Mongoose.Group.findById(req.params.gid)
            .populate([
                {path: 'members'},
                {path: 'purchases'},
            ])
            .catch(error => res.send({error: 500, message: error.message}))
            .then(group => {
                if (!group) return res.sendStatus(406);
                if (!checkAccess(group, req.session.userId)) return res.sendStatus(403)
                res.send(group.purchases)
            })

    });

    app.post('/api/group/:gid/message', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(400);
        Mongoose.Group.findById(req.params.gid)
            .catch(error => res.send({error: 500, message: error.message}))
            .then(group => {
                if (!group) return res.sendStatus(406);
                if (!checkAccess(group, req.session.userId)) return res.sendStatus(403);
                group.members.push(group.owner)
                group.members.map(user => Mongoose.Message.create({text: '*' + req.session.passport.user.first_name + '*: ' + req.body.text.substring(0, 50), user}))
                res.sendStatus(200)
            })

    });

    //Mongoose.Purchase.deleteMany({}).then(console.log).catch(console.error)
    app.post('/api/group/:gid/purchase/create', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(400);
        Mongoose.Group.findById(req.params.gid)
            .populate([
                {path: 'members'},
                {path: 'purchases'},
            ])
            .catch(error => res.send({error: 500, message: error.message}))
            .then(group => {
                if (!group) return res.sendStatus(406);
                if (!checkAccess(group, req.session.userId)) return res.sendStatus(403)
                Mongoose.Purchase.create({group, name: moment().format('dddd, DD MMM HH:mm')})
                    .then(() => {
                        group.populate('purchases', () => {
                            res.send(group)
                        })

                    })
            })
    });

    app.post('/api/group/:gid/owner-view', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(400);
        Mongoose.Group.findById(req.params.gid)
            .populate([
                {path: 'owner', populate: ['referrals','parents']},
                {path: 'members'},
            ])
            .catch(error => res.send({error: 500, message: error.message}))
            .then(group => {
                if (!group) return res.sendStatus(406);
                if (group.owner._id.toString() !== req.session.userId) return res.sendStatus(403);
                res.send(group)
            })
    });


    app.post('/api/group/create', passportLib.isLogged, (req, res) => {
        Mongoose.User.findById(req.session.userId)
            .catch(error => res.send({error: 500, message: error.message}))
            .then(owner => {
                Mongoose.Group.create({owner, name: moment().format('dddd, DD MMM HH:mm')})
                    .catch(error => {
                        res.send({error: 500, message: error.message})
                    })
                    .then(p => {
                        res.send(p)
                    });
            })
    });

    app.post('/api/group/list/user', passportLib.isLogged, (req, res) => {
        const query = {$or: [{owner: req.session.userId}, {members: {$in: req.session.userId}}]};
        Mongoose.Group.find(query)
            .populate(['owner', 'purchases', 'members'])
            .sort({createdAt: -1})
            .then(groups => {
                res.send({
                    my: groups.filter(g => g.owner._id.toString() === req.session.userId.toString()),
                    invited: groups.filter(g => g.owner._id.toString() !== req.session.userId.toString()),
                })
            });
    });

    app.post('/api/group/:gid/attach-user/:uid', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(400);
        if (!Mongoose.Types.ObjectId.isValid(req.params.uid)) return res.sendStatus(400);
        Mongoose.Group.findOne({_id: req.params.gid, owner: req.session.passport.user})
            .catch(error => res.send({error: 500, message: error.message}))
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

    app.post('/api/group/:gid/detach-user/:uid', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.gid)) return res.sendStatus(400);
        if (!Mongoose.Types.ObjectId.isValid(req.params.uid)) return res.sendStatus(400);
        Mongoose.Group.findOne({_id: req.params.gid, owner: req.session.passport.user})
            .catch(error => res.send({error: 500, message: error.message}))
            .then(group => {
                group.members = group.members.filter(m => m.toString() !== req.params.uid)
                group.save();
                res.send(group)
            })
    });


};
