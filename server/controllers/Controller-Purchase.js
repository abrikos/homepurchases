import Mongoose from "server/db/mongoose";

const passportLib = require('../lib/passport');
const logger = require('logat');
module.exports.controller = function (app) {


    app.post('/api/purchase/:pid', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(400);
        Mongoose.Purchase.findById(req.params.pid)
            .populate('group')
            .catch(error => res.send({error: 500, message: error.message}))
            .then(purchase => {
                if (!purchase) return res.sendStatus(404);
                if (!checkAccess(purchase, req.session.userId)) return res.sendStatus(403);
                res.send(purchase)
            })
    });

    app.post('/api/purchase/:pid/good/add', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(400);
        Mongoose.Purchase.findById(req.params.pid)
            .populate('group')
            .catch(error => res.send({error: 500, message: error.message}))
            .then(purchase => {
                if (!purchase) return res.sendStatus(404);
                if (!checkAccess(purchase, req.session.userId)) return res.sendStatus(403);
                purchase.goods.push(req.body)
                purchase.save();
                res.send(purchase)
            })
    });

    app.post('/api/purchase/:pid/good/:index/save', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(400);
        Mongoose.Purchase.findById(req.params.pid)
            .populate('group')
            .catch(error => res.send({error: 500, message: error.message}))
            .then(purchase => {
                if (!purchase) return res.sendStatus(404);
                if (!checkAccess(purchase, req.session.userId)) return res.sendStatus(403);
                const found = purchase.goods.id(req.params.index);
                found.name  =req.body.name;
                found.quantity  =req.body.quantity;
                found.price  =req.body.price;
                purchase.save();
                res.send(purchase)

            })
    });

    app.post('/api/purchase/:pid/switch', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(400);
        Mongoose.Purchase.findById(req.params.pid)
            .populate('group')
            .catch(error => res.send({error: 500, message: error.message}))
            .then(purchase => {
                if (!purchase) return res.sendStatus(404);
                if (!checkAccess(purchase, req.session.userId)) return res.sendStatus(403);
                purchase.closed = !purchase.closed;
                purchase.save();
                res.send(purchase)

            })
    });

    app.post('/api/purchase/:pid/good/:index/delete', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(400);
        Mongoose.Purchase.findById(req.params.pid)
            .populate('group')
            .catch(error => res.send({error: 500, message: error.message}))
            .then(purchase => {
                if (!purchase) return res.sendStatus(404);
                if (!checkAccess(purchase, req.session.userId)) return res.sendStatus(403);
                purchase.goods.pull({_id:req.params.index});
                purchase.save();
                res.send(purchase)

            })
    });

    function checkAccess(purchase, userId) {
        const mems = purchase.group.members.map(m => (m._id ? m._id : m).toString());
        mems.push((purchase.group.owner._id ? purchase.group.owner._id : purchase.group.owner).toString());
        return mems.includes(userId)
    }

    app.post('/api/purchase/:pid/save', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(400);
        Mongoose.Purchase.findById(req.params.pid)
            .populate('group')
            .catch(error => res.send({error: 500, message: error.message}))
            .then(purchase => {
                if (!purchase) return res.sendStatus(406);
                if (!checkAccess(purchase, req.session.userId)) return res.send(403);
                const fields = ['name'];
                for (const f of fields) {
                    purchase[f] = req.body[f];
                }
                purchase.save()
                    .catch(error => res.send({error: 500, message: error.message}))
                    .then(p => res.send(p))
            })
    });


};
