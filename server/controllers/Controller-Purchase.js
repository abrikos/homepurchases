import Mongoose from "server/db/mongoose";
import moment from "moment";
const passportLib = require('../lib/passport');
const logger = require('logat');
module.exports.controller = function (app) {


    app.post('/api/purchase/:pid', passportLib.isLogged, (req, res) => {
        if (!Mongoose.Types.ObjectId.isValid(req.params.pid)) return res.sendStatus(406);
        Mongoose.User.findById(req.session.userId)
        Mongoose.Purchase.findOne({_id: req.params.pid, owner: req.session.passport.user})
            .catch(error => res.sendStatus(500))
            .then(purchase => {
                purchase.save();
                res.send(purchase)
            })
    });



};
